// catalog-app.ts
var CatalogApp;
(function (CatalogApp) {
    var allCategoriesUrl = "data/catalog.json";
    var categoryHtmlPath = "snipets/categories.html";
    var itemHtmlPath = "snipets/item.html";
    var catalogItemsUrl = "data/categories/";
    var homeHtmlPath = "snipets/home.html";
    var randCategories = ["bread", "rolls", "sweets"];
    function insertHtml(selector, html) {
        var targetElem = document.querySelector(selector);
        if (targetElem) {
            targetElem.innerHTML = html;
        }
    }
    function insertProperty(template, propName, propValue) {
        var propToReplace = "{{".concat(propName, "}}");
        return template.replace(new RegExp(propToReplace, "g"), propValue);
    }
    function ajaxGet(url, callback, isJson) {
        if (isJson === void 0) { isJson = true; }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(isJson ? JSON.parse(xhr.responseText) : xhr.responseText);
            }
        };
        xhr.open("GET", url, true);
        xhr.send(null);
    }
    function loadHome() {
        ajaxGet(homeHtmlPath, function (responseText) {
            insertHtml("#mainHome", responseText);
        }, false);
    }
    CatalogApp.loadHome = loadHome;
    function loadCatalogCategories() {
        ajaxGet(allCategoriesUrl, buildAndShowCategoriesHTML);
    }
    CatalogApp.loadCatalogCategories = loadCatalogCategories;
    function buildAndShowCategoriesHTML(categories) {
        ajaxGet(categoryHtmlPath, function (categoryHtml) {
            var viewHtml = buildCategoriesViewHtml(categories, categoryHtml);
            insertHtml("#mainHome", viewHtml);
        }, false);
    }
    function buildCategoriesViewHtml(categories, categoryHtml) {
        var finalHTML = "<div class='container p-0'><section class='row'>";
        for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
            var category = categories_1[_i];
            var html = categoryHtml;
            html = insertProperty(html, "name", category.name);
            html = insertProperty(html, "short_name", category.short_name);
            finalHTML += html;
        }
        finalHTML += "</section><div class='mt-3 text-center'><a href='#' onclick='CatalogApp.randomCategory()'>Specials</a></div></div>";
        return finalHTML;
    }
    function randomCategory() {
        var randIndex = Math.floor(Math.random() * randCategories.length);
        loadCatalogItems(randCategories[randIndex]);
    }
    CatalogApp.randomCategory = randomCategory;
    function loadCatalogItems(categoryShort) {
        ajaxGet("".concat(catalogItemsUrl).concat(categoryShort, ".json"), buildCategoriesHTML);
    }
    CatalogApp.loadCatalogItems = loadCatalogItems;
    function buildCategoriesHTML(item) {
        ajaxGet(itemHtmlPath, function (itemHtml) {
            var viewHtml = buildAndShowCatalogItemsHTML(item, itemHtml);
            insertHtml("#mainHome", viewHtml);
        }, false);
    }
    function buildAndShowCatalogItemsHTML(item, itemHTML) {
        var finalHTML = "<div class='col text-center mb-4'><h2>".concat(item.cat_name, "</h2></div><section class='row'>");
        for (var _i = 0, _a = item.objects; _i < _a.length; _i++) {
            var obj = _a[_i];
            var html = itemHTML;
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
    // Initialization
    window.addEventListener("DOMContentLoaded", function () {
        var homeLink = document.querySelector("#navHome");
        var catalogLink = document.querySelector("#navCatalog");
        homeLink === null || homeLink === void 0 ? void 0 : homeLink.addEventListener("click", function (e) {
            e.preventDefault();
            loadHome();
        });
        catalogLink === null || catalogLink === void 0 ? void 0 : catalogLink.addEventListener("click", function (e) {
            e.preventDefault();
            loadCatalogCategories();
        });
        loadHome();
    });
})(CatalogApp || (CatalogApp = {}));
// Для глобального доступу
window.CatalogApp = CatalogApp;
