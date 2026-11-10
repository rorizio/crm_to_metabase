(function () {
  "use strict";

  const config = window.PORTFOLIO_CONFIG || {};

  function applyConfig() {
    document.querySelectorAll("[data-config]").forEach(function (el) {
      const key = el.getAttribute("data-config");
      if (!config[key]) return;
      if (el.tagName === "A") {
        el.setAttribute("href", config[key]);
        if (key === "email") el.setAttribute("href", "mailto:" + config[key]);
      } else {
        el.textContent = config[key];
      }
    });

    document.querySelectorAll("[data-email]").forEach(function (el) {
      if (!config.email) return;
      el.setAttribute("href", "mailto:" + config.email);
    });
  }

  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initReveal() {
    const nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (node) {
        node.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    nodes.forEach(function (node) {
      observer.observe(node);
    });

    window.setTimeout(function () {
      nodes.forEach(function (node) {
        node.classList.add("is-visible");
      });
    }, 1600);
  }

  function initCopy() {
    document.querySelectorAll(".copy-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        const block = button.closest(".code-block");
        const code = block ? block.querySelector("code") : null;
        if (!code) return;

        const text = code.innerText;
        const done = function () {
          const original = button.textContent;
          button.textContent = "Copiado!";
          window.setTimeout(function () {
            button.textContent = original;
          }, 1600);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () {
            fallbackCopy(text, done);
          });
        } else {
          fallbackCopy(text, done);
        }
      });
    });
  }

  function fallbackCopy(text, done) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      done();
    } catch (error) {
      console.warn("Não foi possível copiar o código.", error);
    }
    document.body.removeChild(area);
  }

  function initDocNav() {
    const nav = document.querySelector(".doc-nav");
    if (!nav) return;

    const links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    const sections = links
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            const active = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", active);
            link.style.color = active ? "var(--cyan)" : "";
            link.style.background = active ? "rgba(34, 211, 238, 0.08)" : "";
          });
        });
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyConfig();
    initHeader();
    initNav();
    initReveal();
    initCopy();
    initDocNav();
    initYear();
  });
})();
