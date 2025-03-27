// catalog-app.ts
namespace CatalogApp {
    const allCategoriesUrl = "data/catalog.json";
    const categoryHtmlPath = "snipets/categories.html";
    const itemHtmlPath = "snipets/item.html";
    const catalogItemsUrl = "data/categories/";
    const homeHtmlPath = "snipets/home.html";
  
    const randCategories = ["bread", "rolls", "sweets"];
  
    function insertHtml(selector: string, html: string): void {
      const targetElem = document.querySelector(selector);
      if (targetElem) {
        targetElem.innerHTML = html;
      }
    }
  
    function insertProperty(template: string, propName: string, propValue: string): string {
      const propToReplace = `{{${propName}}}`;
      return template.replace(new RegExp(propToReplace, "g"), propValue);
    }
  
    function ajaxGet(url: string, callback: (response: any) => void, isJson: boolean = true): void {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          callback(isJson ? JSON.parse(xhr.responseText) : xhr.responseText);
        }
      };
      xhr.open("GET", url, true);
      xhr.send(null);
    }
  
    export function loadHome(): void {
      ajaxGet(homeHtmlPath, (responseText: string) => {
        insertHtml("#mainHome", responseText);
        addHomeButtonListeners();
      }, false);
    }
  
    export function loadCatalogCategories(): void {
      ajaxGet(allCategoriesUrl, buildAndShowCategoriesHTML);
    }
  
    function buildAndShowCategoriesHTML(categories: any[]): void {
      ajaxGet(categoryHtmlPath, (categoryHtml: string) => {
        const viewHtml = buildCategoriesViewHtml(categories, categoryHtml);
        insertHtml("#mainHome", viewHtml);
        addCategoryEventListeners();
      }, false);
    }
  
    function buildCategoriesViewHtml(categories: any[], categoryHtml: string): string {
      let finalHTML = "<div class='container p-0'><section class='row'>";
      for (const category of categories) {
        let html = categoryHtml;
        html = insertProperty(html, "name", category.name);
        html = insertProperty(html, "short_name", category.short_name);
        finalHTML += html;
      }
      finalHTML += "</section><div class='mt-3 text-center'><a href='#' onclick='CatalogApp.randomCategory()'>Specials</a></div></div>";
      return finalHTML;
    }
  
    function addCategoryEventListeners(): void {
      const buttons = document.querySelectorAll(".go-to-category-btn");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const card = (btn as HTMLElement).closest(".category-card");
          const shortName = card?.getAttribute("data-category");
          if (shortName) {
            CatalogApp.loadCatalogItems(shortName);
          }
        });
      });
    }
  
    export function randomCategory(): void {
      const randIndex = Math.floor(Math.random() * randCategories.length);
      loadCatalogItems(randCategories[randIndex]);
    }
  
    export function loadCatalogItems(categoryShort: string): void {
      ajaxGet(`${catalogItemsUrl}${categoryShort}.json`, buildCategoriesHTML);
    }
  
    function buildCategoriesHTML(item: any): void {
      ajaxGet(itemHtmlPath, (itemHtml: string) => {
        const viewHtml = buildAndShowCatalogItemsHTML(item, itemHtml);
        insertHtml("#mainHome", viewHtml);
      }, false);
    }
  
    function buildAndShowCatalogItemsHTML(item: any, itemHTML: string): string {
      let finalHTML = `<div class='col text-center mb-4'><h2>${item.cat_name}</h2></div><section class='row'>`;
      for (const obj of item.objects) {
        let html = itemHTML;
        html = insertProperty(html, "short_name", obj.short_name);
        html = insertProperty(html, "name", obj.name);
        html = insertProperty(html, "description", obj.description);
        html = insertProperty(html, "price", obj.price);
        html = insertProperty(html, "img", obj.img);
        finalHTML += html;
      }
      finalHTML += "</section>";
      return finalHTML;
    }
  
    function addHomeButtonListeners(): void {
      const buttons = document.querySelectorAll("[data-action]");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = (btn as HTMLElement).getAttribute("data-action");
          if (action === "catalog") {
            CatalogApp.loadCatalogCategories();
          } else if (action === "random") {
            CatalogApp.randomCategory();
          }
        });
      });
    }
  
    // Initialization
    window.addEventListener("DOMContentLoaded", () => {
      const homeLink = document.querySelector("#navHome");
      const catalogLink = document.querySelector("#navCatalog");
  
      homeLink?.addEventListener("click", (e) => {
        e.preventDefault();
        loadHome();
      });
  
      catalogLink?.addEventListener("click", (e) => {
        e.preventDefault();
        loadCatalogCategories();
      });
  
      loadHome();
    });
  }
  
  // Для глобального доступу
  (window as any).CatalogApp = CatalogApp;