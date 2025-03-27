(function (global) {
    const ns = {};

    const allCategoriesUrl = "data/catalog.json";
    const categoryHtml = "snipets/categories.html";
    const itemHTML = "snipets/item.html";
    const catalogItemsUrl = "data/categories/";
    const homeHtml = "snipets/home.html";
    const randArr=["bread","rolls","sweets"];

    const insertHtml = function (selector, html) {
        const targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    const insertProperty = function (string, propName, propValue) {
        const propToReplace = `{{${propName}}}`;
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    };

    ns.loadCatalogCategories = function () {
        $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
    };


    ns.loadHome = function () {
        $ajaxUtils.sendGetRequest(
          homeHtml,
          function (responseText) {
            document.querySelector("#mainHome").innerHTML = responseText;
          },
          false
        );
      };

    function buildAndShowCategoriesHTML(categories) {
        $ajaxUtils.sendGetRequest(
            categoryHtml,
            function (categoryHTML) {
                const categoriesViewHtml = buildCategoriesViewHtml(
                    categories,
                    categoryHTML
                );
                insertHtml("#mainHome", categoriesViewHtml);
            },
            false
        );
    }
    function buildCategoriesViewHtml(categories, categoryHtml) {
        let finalHTML = "";
        finalHTML += "<div class='container p-0'>";
        finalHTML += "<section class='row'>";
        for (let i = 0; i < categories.length; i++) {
            let html = categoryHtml;
            const name = "" + categories[i].name;
            const short_name = categories[i].short_name;
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHTML += html;
        }
        finalHTML += "</section>";
        finalHTML += "</div>";
        return finalHTML;
    }
    ns.randomCategory=function(){
        ns.loadCatalogItems(randArr[Math.floor(Math.random() * randArr.length)]);  
    }
    ns.loadCatalogItems = function (categoryShort) {
        $ajaxUtils.sendGetRequest(
            catalogItemsUrl + categoryShort + ".json",
            buildCategoriesHTML
        );
    };
    function buildCategoriesHTML(item) {
        $ajaxUtils.sendGetRequest(
            itemHTML,
            function (itemHTML) {
                const itemViewHtml = buildAndShowCatalogItemsHTML(
                    item,
                    itemHTML
                );
                insertHtml("#mainHome", itemViewHtml);
            },
            false
        );
    };

    function buildAndShowCatalogItemsHTML(item, itemHTML) {
        let finalHTML = `<div class="col text-center mb-4"><h2>${item.cat_name}</h2></div><section class='row'>`;
        const catalogItems = item.objects;

        for (let i = 0; i < catalogItems.length; i++) {
            let html = itemHTML;
            html = insertProperty(html, "short_name", catalogItems[i].short_name);
            html = insertProperty(html, "name", catalogItems[i].name);
            html = insertProperty(html, "description", catalogItems[i].description);
            html = insertProperty(html, "price", catalogItems[i].price);
            html = insertProperty(html, "img", catalogItems[i].img);

            finalHTML += html;
        }
        finalHTML += "</section>";
        return finalHTML;
    }

    global.$ns = ns;
})(window);
