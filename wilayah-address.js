(function () {
  const EMSIFA_ROOT='https://www.emsifa.com/api-wilayah-indonesia/api';
  const POSTAL_ROOT='https://kodepos.vercel.app/search/';
  const cache=new Map();
  const labels={province:'Provinsi',regency:'Kabupaten / Kota',district:'Kecamatan',village:'Kelurahan / Desa'};
  let state={province:null,regency:null,district:null,village:null,postalCode:''};
  let activeRoot=null;
  let activeDropdown=null;
  let mountGeneration=0;
  let mountController=null;
  let allRegenciesPromise=null;
  let outsideHandlerAttached=false;

  function normalize(value) {
    return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('id-ID')
      .replace(/^(kota adm\.|kab adm\.|kabupaten administrasi|kota administrasi|kabupaten|kota|kab\.)\s*/,'').trim();
  }
  function emitChange() {
    window.dispatchEvent(new CustomEvent('jobhub-address-change',{detail:{...getValue(),rootId:activeRoot?.id||''}}));
  }
  function escape(value) {
    return String(value||'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function query(selector) {
    return activeRoot?.querySelector(selector)||null;
  }
  function queryAll(selector) {
    return activeRoot?[...activeRoot.querySelectorAll(selector)]:[];
  }
  async function getJson(url) {
    if(cache.has(url))return cache.get(url);
    const request=fetch(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(15000)})
      .then(response=>{
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data=>{
        if(!Array.isArray(data))throw new Error('Format respons API wilayah tidak valid.');
        return data;
      })
      .catch(error=>{
        cache.delete(url);
        throw error;
      });
    cache.set(url,request);
    return request;
  }
  function endpoint(level,parentId) {
    if(level==='province')return `${EMSIFA_ROOT}/provinces.json`;
    const collection={regency:'regencies',district:'districts',village:'villages'}[level];
    return `${EMSIFA_ROOT}/${collection}/${encodeURIComponent(parentId)}.json`;
  }
  function getAllRegencies() {
    if(!allRegenciesPromise) {
      allRegenciesPromise=(async()=>{
        const provinces=await getJson(endpoint('province'));
        const regencies=[];
        for(let offset=0;offset<provinces.length;offset+=6) {
          const batch=provinces.slice(offset,offset+6);
          const results=await Promise.all(batch.map(async province=>({
            province,
            regencies:await getJson(endpoint('regency',province.id))
          })));
          results.forEach(({province,regencies:items})=>items.forEach(item=>regencies.push({
            id:String(item.id),
            name:item.name,
            provinceId:String(province.id),
            provinceName:province.name
          })));
        }
        return regencies.sort((left,right)=>left.name.localeCompare(right.name,'id'));
      })().catch(error=>{
        allRegenciesPromise=null;
        throw error;
      });
    }
    return allRegenciesPromise;
  }
  function isEnabled(level) {
    if(level==='province')return true;
    if(level==='regency')return Boolean(state.province);
    if(level==='district')return Boolean(state.regency);
    return Boolean(state.district);
  }
  function parentId(level) {
    return level==='regency'?state.province?.id:level==='district'?state.regency?.id:state.district?.id;
  }
  function containerMarkup(level) {
    const id=`region-${level}`;
    return `<div class="form-row region-field" data-region-field="${level}">
      <label id="${id}-label">${labels[level]}</label>
      <div class="region-combobox" data-region-combobox="${level}">
        <button type="button" class="region-combobox-trigger" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="${id}-label" aria-controls="${id}-list" data-region-trigger="${level}" disabled>
          <span data-region-value="${level}">${level==='province'?'Memuat provinsi...':`Pilih ${labels[level]}`}</span>
          <span class="region-combobox-actions"><span class="region-spinner" data-region-spinner="${level}" hidden></span><span aria-hidden="true">⌄</span></span>
        </button>
        <div class="region-combobox-popover" data-region-popover="${level}" hidden>
          <input type="search" class="region-combobox-search" data-region-search="${level}" role="searchbox" aria-label="Cari ${labels[level]}" placeholder="Cari ${labels[level].toLocaleLowerCase('id-ID')}..." autocomplete="off">
          <div class="region-combobox-status" data-region-status="${level}" role="status"></div>
          <ul id="${id}-list" role="listbox" aria-labelledby="${id}-label" data-region-options="${level}"></ul>
        </div>
        <button type="button" class="region-clear-button" data-region-clear="${level}" aria-label="Hapus pilihan ${labels[level]}" hidden>&times;</button>
      </div>
    </div>`;
  }
  function mount(root,initial={}) {
    if(!root)return;
    mountController?.abort();
    mountController=new AbortController();
    const {signal}=mountController;
    const generation=++mountGeneration;
    activeRoot=root;
    state={
      province:initial.provinceId||initial.provinceName||initial.province?{id:String(initial.provinceId||''),name:initial.provinceName||initial.province||''}:null,
      regency:initial.regencyId||initial.regencyName||initial.city?{id:String(initial.regencyId||''),name:initial.regencyName||initial.city||''}:null,
      district:initial.districtId||initial.districtName||initial.district?{id:String(initial.districtId||''),name:initial.districtName||initial.district||''}:null,
      village:initial.villageId||initial.villageName||initial.village?{id:String(initial.villageId||''),name:initial.villageName||initial.village||''}:null,
      postalCode:initial.postalCode||''
    };
    root.innerHTML=`<div class="region-api-error" data-region-api-error role="alert" hidden></div><div class="region-grid">${['province','regency','district','village'].map(containerMarkup).join('')}</div>
      <div class="form-row"><label for="candidate-address-line">Alamat lengkap</label><input id="candidate-address-line" name="address" maxlength="300" autocomplete="street-address" value="${escape(initial.address||'')}"></div>
      <div class="region-grid region-grid-small"><div class="form-row"><label for="candidate-rt">RT</label><input id="candidate-rt" name="rt" inputmode="numeric" maxlength="5" value="${escape(initial.rt||'')}"></div><div class="form-row"><label for="candidate-rw">RW</label><input id="candidate-rw" name="rw" inputmode="numeric" maxlength="5" value="${escape(initial.rw||'')}"></div>
      <div class="form-row"><label for="candidate-postal-code">Kode Pos (otomatis)</label><input id="candidate-postal-code" name="postalCode" readonly value="${escape(state.postalCode)}" placeholder="Terisi setelah kelurahan dipilih"><button type="button" class="region-retry" data-postal-retry hidden>Coba lagi mengambil kode pos</button></div></div>
      <div class="region-location-row"><button type="button" class="btn btn-outline btn-small" data-use-location><i class="fa-solid fa-location-crosshairs" aria-hidden="true"></i> Gunakan Lokasi Saya</button><span class="region-location-status" data-location-status role="status"></span><small class="region-attribution">Koordinat hanya digunakan setelah Anda memberi izin; pencocokan dilakukan oleh Esri.</small></div>`;
    root.querySelectorAll('[data-region-trigger]').forEach(button=>button.addEventListener('click',()=>toggle(button.dataset.regionTrigger),{signal}));
    root.querySelectorAll('[data-region-search]').forEach(input=>{
      input.addEventListener('input',()=>renderOptions(input.dataset.regionSearch),{signal});
      input.addEventListener('keydown',handleKeydown,{signal});
    });
    root.querySelectorAll('[data-region-options]').forEach(list=>list.addEventListener('click',event=>{
      const option=event.target.closest('[data-region-option]');
      if(option)select(option.dataset.regionLevel,option.dataset.regionId,option.dataset.regionName);
    },{signal}));
    root.querySelectorAll('[data-region-options]').forEach(list=>list.addEventListener('keydown',handleOptionKeydown,{signal}));
    root.querySelectorAll('[data-region-clear]').forEach(button=>button.addEventListener('click',()=>clear(button.dataset.regionClear),{signal}));
    root.querySelector('[data-use-location]')?.addEventListener('click',()=>useCurrentLocation(root,generation),{signal});
    root.querySelector('[data-postal-retry]')?.addEventListener('click',lookupPostalCode,{signal});
    root.querySelectorAll('[name="address"],[name="rt"],[name="rw"]').forEach(input=>input.addEventListener('input',emitChange,{signal}));
    if(!outsideHandlerAttached) {
      document.addEventListener('click',closeOnOutsideClick);
      outsideHandlerAttached=true;
    }
    updateControls();
    loadOptions('province').then(async()=>{
      if(generation!==mountGeneration)return;
      updateControls();
      await restoreSelection(generation);
    }).catch(error=>{
      if(generation!==mountGeneration)return;
      showError('province',error);
    });
  }
  async function restoreSelection(generation) {
    for(const level of ['province','regency','district','village']) {
      if(generation!==mountGeneration)return;
      const selected=state[level];
      if(!selected)continue;
      const options=await loadOptions(level);
      const match=options.find(item=>String(item.id)===selected.id||normalize(item.name)===normalize(selected.name));
      if(!match) {
        clear(level);
        return;
      }
      state[level]=match;
      updateControls();
    }
    if(state.village&&state.postalCode)query('#candidate-postal-code').value=state.postalCode;
  }
  async function loadOptions(level) {
    const spinner=query(`[data-region-spinner="${level}"]`);
    if(spinner)spinner.hidden=false;
    try {
      const options=await getJson(endpoint(level,parentId(level)));
      query('[data-region-api-error]')?.setAttribute('hidden','');
      return options;
    } finally {
      if(spinner)spinner.hidden=true;
    }
  }
  function toggle(level) {
    if(!isEnabled(level))return;
    const popover=query(`[data-region-popover="${level}"]`);
    if(!popover)return;
    const opening=popover.hidden;
    closeAll();
    if(!opening)return;
    popover.hidden=false;
    query(`[data-region-trigger="${level}"]`)?.setAttribute('aria-expanded','true');
    const search=query(`[data-region-search="${level}"]`);
    if(search) {
      search.value='';
      search.focus();
    }
    renderOptions(level);
    const generation=mountGeneration;
    loadOptions(level).then(()=>{
      if(generation===mountGeneration)renderOptions(level);
    }).catch(error=>{if(generation===mountGeneration)showError(level,error);});
  }
  function closeAll() {
    queryAll('[data-region-popover]').forEach(popover=>popover.hidden=true);
    queryAll('[data-region-trigger]').forEach(button=>button.setAttribute('aria-expanded','false'));
    activeDropdown=null;
  }
  function closeOnOutsideClick(event) {
    if(!event.target.closest('.region-combobox'))closeAll();
  }
  function handleKeydown(event) {
    const level=event.currentTarget.dataset.regionSearch;
    const list=query(`[data-region-options="${level}"]`);
    const items=[...(list?.querySelectorAll('[role="option"]')||[])];
    const current=items.indexOf(document.activeElement);
    if(event.key==='ArrowDown'||event.key==='ArrowUp') {
      event.preventDefault();
      activeDropdown=level;
      const index=event.key==='ArrowDown'?Math.min(current+1,items.length-1):Math.max(current<=0?0:current-1,0);
      items[index]?.focus();
    } else if(event.key==='Enter'&&items.length) {
      event.preventDefault();
      items[Math.max(0,current)]?.click();
    } else if(event.key==='Escape') {
      closeAll();
      query(`[data-region-trigger="${level}"]`)?.focus();
    }
  }
  function handleOptionKeydown(event) {
    const level=event.currentTarget.dataset.regionOptions;
    const items=[...event.currentTarget.querySelectorAll('[role="option"]')];
    const index=items.indexOf(event.target.closest('[role="option"]'));
    if(event.key==='ArrowDown'||event.key==='ArrowUp') {
      event.preventDefault();
      const next=event.key==='ArrowDown'?Math.min(index+1,items.length-1):Math.max(index-1,0);
      items[next]?.focus();
    } else if(event.key==='Enter') {
      event.preventDefault();
      event.target.closest('[role="option"]')?.click();
    } else if(event.key==='Escape') {
      closeAll();
      query(`[data-region-trigger="${level}"]`)?.focus();
    }
  }
  function renderOptions(level) {
    const list=query(`[data-region-options="${level}"]`);
    const status=query(`[data-region-status="${level}"]`);
    if(!list||!status)return;
    try {
      const request=cache.get(endpoint(level,parentId(level)));
      if(!request) {
        status.innerHTML='<span class="region-inline-loading"></span> Memuat wilayah...';
        list.innerHTML='';
        return;
      }
      const resolved=request;
      resolved.then(items=>{
        if(activeDropdown!==level&&!query(`[data-region-popover="${level}"]:not([hidden])`))return;
        const searchTerm=normalize(query(`[data-region-search="${level}"]`)?.value);
        const filtered=items.filter(item=>normalize(item.name).includes(searchTerm));
        if(!filtered.length) {
          status.textContent='Wilayah tidak ditemukan.';
          list.innerHTML='';
          return;
        }
        status.textContent=`${filtered.length} pilihan`;
        list.innerHTML=filtered.slice(0,100).map(item=>`<li role="option" tabindex="0" aria-selected="${state[level]?.id===String(item.id)}" data-region-option data-region-level="${level}" data-region-id="${escape(item.id)}" data-region-name="${escape(item.name)}">${escape(item.name)}</li>`).join('');
      }).catch(()=>{});
    } catch(error) {showError(level,error);}
  }
  function showError(level,error) {
    const status=query(`[data-region-status="${level}"]`);
    const list=query(`[data-region-options="${level}"]`);
    if(status)status.innerHTML=`<span>Gagal mengambil data wilayah.</span> <button type="button" class="region-retry" data-region-retry="${level}">Coba Lagi</button>`;
    if(list)list.innerHTML='';
    const globalError=query('[data-region-api-error]');
    if(globalError) {
      globalError.hidden=false;
      globalError.innerHTML=`Gagal mengambil data wilayah. <button type="button" class="region-retry" data-region-retry-global>Coba Lagi</button>`;
      globalError.querySelector('button')?.addEventListener('click',()=>{
        cache.delete(endpoint(level,parentId(level)));
        loadOptions(level).then(()=>renderOptions(level)).catch(retryError=>showError(level,retryError));
      },{once:true});
    }
    const retry=status?.querySelector('[data-region-retry]');
    retry?.addEventListener('click',()=>{
      cache.delete(endpoint(level,parentId(level)));
      loadOptions(level).then(()=>renderOptions(level)).catch(retryError=>showError(level,retryError));
    });
    const trigger=query(`[data-region-trigger="${level}"]`);
    if(trigger)trigger.disabled=level!=='province'&&!isEnabled(level);
    if(error)console.warn('Region lookup failed:',error);
  }
  function updateControls() {
    ['province','regency','district','village'].forEach(level=>{
      const trigger=query(`[data-region-trigger="${level}"]`);
      if(!trigger)return;
      const enabled=isEnabled(level);
      trigger.disabled=!enabled;
      trigger.querySelector(`[data-region-value="${level}"]`).textContent=state[level]?.name||`Pilih ${labels[level]}`;
      const clearButton=query(`[data-region-clear="${level}"]`);
      if(clearButton)clearButton.hidden=!state[level];
      const spinner=query(`[data-region-spinner="${level}"]`);
      if(spinner)spinner.hidden=true;
    });
    const postal=query('#candidate-postal-code');
    if(postal)postal.value=state.postalCode||'';
  }
  async function select(level,id,name) {
    const previous=state[level];
    state[level]={id:String(id),name};
    if(level==='province'&&previous?.id!==state.province.id)resetDescendants('province');
    else if(level==='regency'&&previous?.id!==state.regency.id)resetDescendants('regency');
    else if(level==='district'&&previous?.id!==state.district.id)resetDescendants('district');
    if(level==='village')state.postalCode='';
    updateControls();
    closeAll();
    if(level==='village')await lookupPostalCode();
    if(level!=='village') {
      const child={province:'regency',regency:'district',district:'village'}[level];
      const generation=mountGeneration;
      if(child)loadOptions(child).then(()=>{
        if(generation===mountGeneration)renderOptions(child);
      }).catch(error=>{
        if(generation!==mountGeneration)return;
        const popover=query(`[data-region-popover="${child}"]`);
        if(popover)popover.hidden=false;
        showError(child,error);
      });
    }
    emitChange();
  }
  function resetDescendants(level) {
    const descendants=level==='province'?['regency','district','village']:level==='regency'?['district','village']:['village'];
    descendants.forEach(item=>{state[item]=null;cache.delete(endpoint(item,parentId(item)));});
    state.postalCode='';
  }
  function clear(level) {
    state[level]=null;
    resetDescendants(level);
    updateControls();
    closeAll();
    emitChange();
  }
  async function lookupPostalCode() {
    if(!state.village)return;
    const postal=query('#candidate-postal-code');
    const village=state.village.name;
    const selectedVillageId=state.village.id;
    const hierarchy={district:state.district?.name,regency:state.regency?.name,province:state.province?.name};
    const generation=mountGeneration;
    const queryText=[village,hierarchy.district,hierarchy.regency,hierarchy.province].map(normalize).filter(Boolean).join(' ');
    if(postal)postal.placeholder='Mencari kode pos...';
    try {
      const params=new URLSearchParams({q:queryText});
      const response=await fetch(`${POSTAL_ROOT}?${params}`,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(12000)});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const result=await response.json();
      const candidates=Array.isArray(result.data)?result.data:[];
      const match=candidates.find(item=>normalize(item.village)===normalize(village)
        &&normalize(item.district)===normalize(hierarchy.district)
        &&normalize(item.regency)===normalize(hierarchy.regency)
        &&normalize(item.province)===normalize(hierarchy.province));
      if(generation!==mountGeneration||state.village?.id!==selectedVillageId)return;
      state.postalCode=match?String(match.code):'';
      if(postal)postal.placeholder=match?'Terisi otomatis':'Kode pos tidak tersedia untuk kelurahan ini';
      const retry=query('[data-postal-retry]');
      if(retry)retry.hidden=Boolean(match);
    } catch(error) {
      if(generation!==mountGeneration||state.village?.id!==selectedVillageId)return;
      if(postal)postal.placeholder='Kode pos gagal dimuat';
      const retry=query('[data-postal-retry]');
      if(retry)retry.hidden=false;
      console.warn('Postal code lookup failed:',error);
    }
    updateControls();
  }
  async function useCurrentLocation(root,generation) {
    const status=root.querySelector('[data-location-status]');
    if(!navigator.geolocation) {
      status.textContent='Geolocation tidak tersedia di browser ini.';
      return;
    }
    status.textContent='Meminta izin lokasi...';
    navigator.geolocation.getCurrentPosition(async position=>{
      try {
        const {latitude,longitude}=position.coords;
        const response=await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${encodeURIComponent(`${longitude},${latitude}`)}&f=json&langCode=id`,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(15000)});
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        const result=await response.json();
        const address=result.address||{};
        const wanted={
          province:[address.Region,address.RegionAbbr],
          regency:[address.Subregion,address.City],
          district:[address.City,address.District,address.MetroArea],
          village:[address.Neighborhood,address.PlaceName,address.ShortLabel]
        };
        const generationAtRequest=generation;
        for(const level of ['province','regency','district','village']) {
          if(generationAtRequest!==mountGeneration)return;
          const options=await loadOptions(level);
          const names=wanted[level].map(normalize).filter(Boolean);
          const chosen=options.find(item=>names.includes(normalize(item.name)))
            ||options.find(item=>names.some(name=>normalize(item.name).includes(name)||name.includes(normalize(item.name))));
          if(!chosen)throw new Error(`Wilayah ${labels[level].toLowerCase()} tidak cocok dengan lokasi yang terdeteksi.`);
          await select(level,chosen.id,chosen.name);
        }
        status.textContent='Provinsi, kabupaten, dan kecamatan terisi dari lokasi Anda.';
      } catch(error) {
        status.textContent='Lokasi berhasil dideteksi, tetapi data wilayah tidak dapat dicocokkan. Pilih manual.';
        console.warn('Reverse geocoding failed:',error);
      }
    },error=>{
      status.textContent=error.code===1?'Izin lokasi ditolak. Anda tetap dapat memilih wilayah manual.':'Lokasi tidak dapat dideteksi. Coba pilih wilayah manual.';
    },{enableHighAccuracy:false,timeout:12000,maximumAge:300000});
  }
  function getValue() {
    return {
      provinceId:state.province?.id||'',provinceName:state.province?.name||'',
      regencyId:state.regency?.id||'',regencyName:state.regency?.name||'',
      districtId:state.district?.id||'',districtName:state.district?.name||'',
      villageId:state.village?.id||'',villageName:state.village?.name||'',
      postalCode:state.postalCode,
      address:query('#candidate-address-line')?.value.trim()||'',
      rt:query('#candidate-rt')?.value.trim()||'',
      rw:query('#candidate-rw')?.value.trim()||''
    };
  }
  window.JobHubAddress={mount,getValue,getAllRegencies};
})();
