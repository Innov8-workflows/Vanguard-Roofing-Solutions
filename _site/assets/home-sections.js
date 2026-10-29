(function(){"use strict";
if(document.querySelector(".case-frame video")){
  (function(){
    var vids = document.querySelectorAll(".case-frame video");
    if (!vids.length) return;
    vids.forEach(function(v){ v.muted = true; v.controls = false; v.removeAttribute("controls"); });
    if (!("IntersectionObserver" in window)){ vids.forEach(function(v){ v.play().catch(function(){}); }); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) en.target.play().catch(function(){});
        else en.target.pause();
      });
    }, {threshold:0, rootMargin:"200px 0px 200px 0px"});
    vids.forEach(function(v){ io.observe(v); });
  })();
}
if(document.querySelector(".ba-slider")){
  document.querySelectorAll(".ba-slider").forEach(function(s){
    var range = s.querySelector(".ba-range"), dragging = false, touched = false;
    function set(p){ p = Math.max(0, Math.min(100, p)); s.style.setProperty("--pos", p + "%"); range.value = Math.round(p); }
    function fromX(x){ var r = s.getBoundingClientRect(); set((x - r.left) / r.width * 100); }
    s.addEventListener("pointerdown", function(e){ if (e.pointerType !== "mouse") return; dragging = true; touched = true; s.setPointerCapture(e.pointerId); fromX(e.clientX); });
    s.addEventListener("pointermove", function(e){ if (dragging) fromX(e.clientX); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function(t){ s.addEventListener(t, function(){ dragging = false; }); });
    var tx = 0, ty = 0, horiz = null;
    s.addEventListener("touchstart", function(e){ tx = e.touches[0].clientX; ty = e.touches[0].clientY; horiz = null; touched = true; }, {passive:true});
    s.addEventListener("touchmove", function(e){
      var t = e.touches[0];
      if (horiz === null) horiz = Math.abs(t.clientX - tx) > Math.abs(t.clientY - ty);
      if (horiz){ e.preventDefault(); fromX(t.clientX); }
    }, {passive:false});
    range.addEventListener("input", function(){ touched = true; set(+range.value); });
    
    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches){
      var io = new IntersectionObserver(function(en){
        if (!en[0].isIntersecting) return;
        io.disconnect();
        var steps = [50, 30, 70, 50], i = 0;
        (function next(){ if (touched || i >= steps.length) return; animate(steps[i++], next); })();
      }, {threshold:.6});
      io.observe(s);
    }
    function animate(to, done){
      var from = parseFloat(s.style.getPropertyValue("--pos")) || 50, t0 = null;
      function step(t){
        if (touched) return;
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / 650), e = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2) / 2;
        set(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(step); else setTimeout(done, 120);
      }
      requestAnimationFrame(step);
    }
  });
}
if(document.querySelector("#revTrack")){
  (function(){
    var reviews = [
      {src:"g", h:"David M.", w:"Google review", t:"We had a leak in our roof, John from Vanguard came round the same day. He was very polite and explained the work needed in detail and the price. He did a great job and was very tidy. He even gave me some advice on a product to protect my roof and where I could buy it. It was a pleasure to deal with such an honest tradesman. I would thoroughly recommend this company."},
      {src:"g", h:"Hazel C.", w:"Google review", t:"We had an excellent experience with this roofing company from start to finish. They replaced our entire roof and did truly extraordinary work. The team was professional, knowledgeable, and very attentive to detail throughout the process. The quality of craftsmanship was outstanding, and everything was completed on time and as promised."},
      {src:"g", h:"Kate and Rich B.", w:"Google review", t:"Great service from John and his team. Second time working with them, speedy service and great attention to detail. On the day, he noted a few other issues to be addressed and did those at no extra cost, which was much appreciated. Quality job all round - would highly recommend!"},
      {src:"g", h:"Shannon C.", w:"Google review", t:"We were getting some water in loft during the rain earlier in the week and gave John a call ( it’s our second time using him ) he came straight out and diagnosed the problem. He then booked us in right away and got it fixed for us the next day! Fantastic service yet again!"},
      {src:"g", h:"Serge V.", w:"Google review", t:"John is a true wizard, and a gentleman roofer! He came to rescue me at time of despair. Not long ago a fake building company shamelessly abandoned the site and blocked my number (typical). I was forced to cry for help. Luckily, John saw my advert and took the job. In a blink of an eye he diagnosed the cause and fixed the structural problem left by the runaway builder. I can honestly say that John always puts his customers and professional honour first. He's pedantic, always able to explain all the background and all ways to eliminate the issue in plain English. When people like John take care of your home this country has a bright future. Thank you, the Roof Master"},
      {src:"g", h:"Joanne M.", w:"Google review", t:"The guys done a repair for me and were brilliant. Communicated well and were professional the whole way through. Arrived when they said they would and always polite to me. I had other quotes but vanguard was the best and glad I went with them. Would defo recommend and il use them again."}
    ];
    var STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>';
    var LOGOS = {
      g: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>',
      f: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
      
    };
    var FOOT = { g: "Review left on Google", f: "Recommended on Facebook" };
    var track = document.getElementById("revTrack"), dotsWrap = document.getElementById("revDots");
    function esc(s){ return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
    reviews.forEach(function(r){
      var cell = document.createElement("div");
      cell.className = "rev-cell";
      cell.innerHTML =
        '<article class="rev-card">' +
          '<div class="rev-top"><div class="rev-av">' + (LOGOS[r.src] || LOGOS.g) + '</div>' +
          '<div class="rev-who"><b>' + esc(r.h) + '</b><span>' + esc(r.w) + '</span></div></div>' +
          '<div class="rev-stars" role="img" aria-label="Rated 5 out of 5">' + STAR + STAR + STAR + STAR + STAR + '</div>' +
          '<div class="rev-body"><p>' + esc(r.t) + '</p><button type="button" class="rev-more" hidden>Read more</button></div>' +
          '<div class="rev-foot">' + esc(r.foot || FOOT[r.src] || ("Verified " + r.src + " review" + (r.d ? ", " + r.d : ""))) + '</div>' +
        '</article>';
      track.appendChild(cell);
    });
    function clampCheck(){
      track.querySelectorAll(".rev-card").forEach(function(card){
        if (card.classList.contains("open")) return;
        var p = card.querySelector(".rev-body p");
        card.querySelector(".rev-more").hidden = p.scrollHeight <= p.clientHeight + 2;
      });
    }
    track.addEventListener("click", function(e){
      var b = e.target.closest(".rev-more");
      if (!b) return;
      var card = b.closest(".rev-card"), open = card.classList.toggle("open");
      b.textContent = open ? "Show less" : "Read more";
    });
    clampCheck();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(clampCheck);
    window.addEventListener("resize", clampCheck);
    function perView(){ return window.innerWidth <= 680 ? 1 : (window.innerWidth <= 1024 ? 2 : 3); }
    var pv = perView(), page = 0, timer;
    function pages(){ return Math.max(1, Math.ceil(reviews.length / pv)); }
    function buildDots(){
      dotsWrap.innerHTML = "";
      for (var i = 0; i < pages(); i++){
        (function(i){
          var b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-label", "Reviews page " + (i+1));
          b.addEventListener("click", function(){ go(i); reset(); });
          dotsWrap.appendChild(b);
        })(i);
      }
    }
    function go(n){
      var pc = pages();
      page = (n + pc) % pc;
      track.style.transform = "translateX(-" + (page*100) + "%)";
      dotsWrap.querySelectorAll("button").forEach(function(b, k){ b.classList.toggle("active", k === page); });
    }
    function reset(){ clearInterval(timer); timer = setInterval(function(){ go(page+1); }, 6500); }
    buildDots(); go(0); reset();
    var view = document.getElementById("revView");
    view.addEventListener("mouseenter", function(){ clearInterval(timer); });
    view.addEventListener("mouseleave", reset);
    document.getElementById("revPrev").addEventListener("click", function(){ go(page-1); reset(); });
    document.getElementById("revNext").addEventListener("click", function(){ go(page+1); reset(); });
    var sx = 0, sy = 0;
    view.addEventListener("touchstart", function(e){ sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, {passive:true});
    view.addEventListener("touchend", function(e){
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)){ go(page + (dx < 0 ? 1 : -1)); reset(); }
    }, {passive:true});
    window.addEventListener("resize", function(){
      var n = perView();
      if (n !== pv){ pv = n; buildDots(); go(0); reset(); }
    });
    document.addEventListener("visibilitychange", function(){ if (document.hidden) clearInterval(timer); else reset(); });
  })();
}
var WA = "447939987049";
if(document.querySelector("#quoteForm")){
  document.getElementById("quoteForm").addEventListener("submit", function(e){
    e.preventDefault();
    var f = e.target;
    var v = function(k){ return (f.elements[k] && f.elements[k].value || "").trim(); };
    if (!v("name") || !v("phone")){
      var bad = !v("name") ? f.elements.name : f.elements.phone;
      bad.focus();
      bad.style.borderColor = "#E4574C";
      setTimeout(function(){ bad.style.borderColor = ""; }, 2200);
      return;
    }
    var lines = ["Hi John, I found you on your website and would like a quote.", "", "Name: " + v("name"), "Phone: " + v("phone")];
    if (v("service")) lines.push("Service: " + v("service"));
    if (v("detail")) lines.push("Details: " + v("detail"));
    var url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n"));
    var win = window.open(url, "_blank");
    if (!win) window.location.href = url;
  });
}
if(document.getElementById("owGrid")){(function(){
  var items=Array.prototype.slice.call(document.querySelectorAll("#owGrid .ow-item"));
  var lb=document.getElementById("lightbox"),lbImg=document.getElementById("lbImg"),lbCap=document.getElementById("lbCap"),ci=0;
  function show(){var im=items[ci].querySelector("img"),cap=items[ci].querySelector(".gal-cap");lbImg.src=im.src;lbImg.alt=im.alt;lbCap.innerHTML=(cap?cap.textContent:"")+"<small>"+(ci+1)+" of "+items.length+"</small>";}
  function open(n){ci=n;show();lb.classList.add("open");document.body.style.overflow="hidden";}
  function close(){lb.classList.remove("open");document.body.style.overflow="";}
  function go(d){ci=(ci+d+items.length)%items.length;show();}
  items.forEach(function(it,n){it.addEventListener("click",function(){open(n);});});
  document.getElementById("lbClose").addEventListener("click",close);
  document.getElementById("lbPrev").addEventListener("click",function(e){e.stopPropagation();go(-1);});
  document.getElementById("lbNext").addEventListener("click",function(e){e.stopPropagation();go(1);});
  lb.addEventListener("click",function(e){if(e.target===lb)close();});
  document.addEventListener("keydown",function(e){if(!lb.classList.contains("open"))return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")go(-1);if(e.key==="ArrowRight")go(1);});
})();}
})();
