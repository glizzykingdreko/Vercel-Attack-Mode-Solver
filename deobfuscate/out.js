a0_0x53aba4(_vcrct).then(
  _0x38adda => a0_0x33123d(_vcrct, _0x38adda)
).then(() => location.reload()).catch(console.error);
async function a0_0x356ef3(_0x4c2469) {
  const _0x2b681c = new TextEncoder().encode(_0x4c2469),
    _0x3b3c20 = await crypto.subtle.digest("SHA-256", _0x2b681c),
    _0x32326e = Array.from(new Uint8Array(_0x3b3c20));
  return _0x32326e.map(_0x360da4 => _0x360da4.toString(16).padStart(2, '0')).join('');
}
async function a0_0x390c04(_0x4ab763, _0x24664d) {
  while (!![]) {
    const _0x5793c7 = Math.random().toString(36).substring(2, 15),
      _0x10ca64 = await a0_0x356ef3(_0x4ab763 + _0x5793c7);
    if (_0x10ca64.startsWith(_0x24664d)) {
      const _0x325d2a = {};
      return _0x325d2a.key = _0x5793c7, _0x325d2a.hash = _0x10ca64, _0x325d2a;
    }
  }
}
async function a0_0x53aba4(_0x316eab) {
  const _0x2f6998 = function () {
      let _0x39173f = !![];
      return function (_0x237812, _0x21e34e) {
        const _0x197ea6 = _0x39173f ? function () {
          if (_0x21e34e) {
            const _0x25b0ca = _0x21e34e.apply(_0x237812, arguments);
            return _0x21e34e = null, _0x25b0ca;
          }
        } : function () {};
        return _0x39173f = ![], _0x197ea6;
      };
    }(),
    _0x5cf05b = _0x2f6998(this, function () {
      return _0x5cf05b.toString().search("(((.+)+)+)+$").toString().constructor(_0x5cf05b).search("(((.+)+)+)+$");
    });
  _0x5cf05b();
  const _0x59a830 = atob(_0x316eab.split('.')[3]),
    [_0xeb9be6, _0x1ead99, _0x3b787e, _0x49ce62] = _0x59a830.split(';'),
    _0x469406 = [];
  let _0x4edf27 = _0x3b787e;
  for (let _0x206338 = 0; _0x206338 < Number(_0x49ce62); _0x206338++) {
    const _0x4f9acc = await a0_0x390c04(_0x1ead99, _0x4edf27);
    _0x469406.push(_0x4f9acc.key), _0x4edf27 = _0x4f9acc.hash.slice(-_0x4edf27.length);
  }
  return _0x469406.join(';');
}
async function a0_0x33123d(_0x46e7a9, _0x27920d) {
  const _0xf5931c = {};
  _0xf5931c["x-vercel-challenge-token"] = _0x46e7a9, 
  _0xf5931c["x-vercel-challenge-solution"] = _0x27920d;
  const _0xa12ba6 = {};
  return _0xa12ba6.method = "POST", _0xa12ba6.headers = _0xf5931c, fetch(window.location.origin + "/.well-known/vercel/security/request-challenge", _0xa12ba6);
}