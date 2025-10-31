/* login.js
   - Works from file:// and http(s)
   - Demo creds: admin@traffic.ai / admin123
   - Button click + Enter key, robust redirect
*/
(function(){
  var form = document.getElementById('login-form');
  var emailEl = document.getElementById('email');
  var passEl = document.getElementById('password');
  var errorEl = document.getElementById('login-error');
  var btn = document.getElementById('login-btn');

  var DEMO = { email: 'admin@traffic.ai', password: 'admin123' };
  var USE_BACKEND = false; // set true only if you add a real backend

  function setError(msg){ if(errorEl) errorEl.textContent = msg || ''; }
  function setLoading(isLoading){
    if(!btn) return;
    btn.disabled = !!isLoading;
    btn.innerHTML = isLoading
      ? '<i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i> Checking...'
      : '<i class="ri-login-circle-line"></i> Login';
  }
  (function(){ var s=document.createElement('style'); s.textContent='@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}'; document.head.appendChild(s); })();

  function saveAuth(data){
    try{ localStorage.setItem('ai-traffic-auth', JSON.stringify(data)); }
    catch(e){ try{ sessionStorage.setItem('ai-traffic-auth', JSON.stringify(data)); }catch(_){} }
  }
  function goDashboard(){
    var dashUrl = new URL('dashboard.html', window.location.href).toString();
    window.location.assign(dashUrl);
  }
  function localValidate(email, password){
    return email === DEMO.email && password === DEMO.password;
  }

  function handleSubmit(e){
    if(e && e.preventDefault) e.preventDefault();
    setError('');
    var email = (emailEl && emailEl.value || '').trim();
    var password = (passEl && passEl.value || '').trim();

    if(!email || !password){
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);

    if(localValidate(email, password)){
      setTimeout(function(){
        setLoading(false);
        saveAuth({ email: email, token: 'demo-token', ts: Date.now() });
        goDashboard();
      }, 250);
      return;
    }

    if(USE_BACKEND){
      fetch('/api/login', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ email: email, password: password }) })
      .then(function(res){ if(!res.ok) throw new Error('Invalid credentials'); return res.json(); })
      .then(function(data){
        setLoading(false);
        saveAuth({ email: email, token: data.token || 'mock-token', ts: Date.now() });
        goDashboard();
      })
      .catch(function(){
        setLoading(false);
        setError('Invalid credentials. Use admin@traffic.ai / admin123');
      });
    } else {
      setLoading(false);
      setError('Invalid credentials. Use admin@traffic.ai / admin123');
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    if(!form || !emailEl || !passEl || !btn){
      console.error('Login elements not found. Check your index.html IDs and file paths.');
      return;
    }
    form.addEventListener('submit', handleSubmit);
    btn.addEventListener('click', handleSubmit);
    [emailEl, passEl].forEach(function(el){ el && el.addEventListener('keyup', function(ev){ if(ev.key === 'Enter'){ handleSubmit(ev); } }); });
  });
})();