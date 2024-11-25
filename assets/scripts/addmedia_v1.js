(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define("simditor-addmedia", ["jquery", "simditor"], function (a0, b1) {
      return (root["AddMediaButton"] = factory(a0, b1));
    });
  } else if (typeof exports === "object") {
    module.exports = factory(require("jquery"), require("simditor"));
  } else {
    root["SimditorAddMedia"] = factory(root["jQuery"], root["Simditor"]);
  }
})(this, function ($, Simditor) {
  var AddMediaButton,
    __hasProp = {}.hasOwnProperty,
    __extends = function (child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  const GIPHY_API_KEY = "tRUhe1puacG64XnKumufdd3yunw91q00";
  const UNSPLASH_ACCESS_KEY = "S6dwtFdIjNtre8yyA2IJ2DVv84nGFyGPFmg-WO7FnXQ";
  const TENOR_API_KEY = "AIzaSyBZiBelZJMBmMiwgd1jfTKUhK8kBYfIAho";

  AddMediaButton = (function (_super) {
    __extends(AddMediaButton, _super);

    AddMediaButton.i18n = {
      "zh-CN": {
        addMedia: "Add Media",
      },
      "en-US": {
        addMedia: "Insert Image",
      },
    };

    AddMediaButton.prototype.name = "addmedia";
    AddMediaButton.prototype.icon = "add-media";
    AddMediaButton.prototype.menu = true;

    function AddMediaButton() {
      var args;
      args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
      AddMediaButton.__super__.constructor.apply(this, args);
    }

    AddMediaButton.prototype.renderMenu = function () {
      var tpl;
      tpl = `
        <ul class="custom-image-menu">
          <li data-provider="Giphy"> <a href="#" class="menu-item">Giphy</a> </li>
          <li data-provider="Unsplash"> <a href="#" class="menu-item">Unsplash</a> </li>
          <li data-provider="Tenor"> <a href="#" class="menu-item">Tenor</a> </li>
        </ul>
        `;
      this.menuWrapper.html(tpl);

      this.menuWrapper.on(
        "click",
        "li",
        (function (_this) {
          return function (e) {
            var provider = $(e.currentTarget).data("provider");
            _this.openOverlay(provider);
          };
        })(this)
      );
    };

    AddMediaButton.prototype.openOverlay = function (provider) {
      var _this = this;

      if (provider === "Giphy") {
        var poweredBy = `<img src="/assets/images/powered-by-giphy.png" style="align-self:center" />`;
      } else if (provider === "Unsplash") {
        var poweredBy = `<span style="margin:0 auto;">Powered By: <strong>${provider}</strong></span>`;
      } else if (provider === "Tenor") {
        var poweredBy = `<img src="/assets/images/powered-by-tenor.png" style="align-self:center" />`;
      }
      var overlay = $(`
        <div class="custom-image-overlay">
          <div class="overlay-content">
            <span class="close-btn">&times;</span>
              <h3>${provider} Image Selector</h3>
              
              <div class="search-container">
              <input type="text" class="search-input" placeholder="Search ${provider}..." />
              <button class="search-btn">Search</button>
              </div>
              ${poweredBy}
              <div class="image-list-wrapper">
                <div class="image-list"></div>
              </div>
              <div class="loader" style="display: none; text-align: center; padding: 10px;">Loading...</div>
          </div>
          </div>`);
      $("body").append(overlay);

      overlay.find(".close-btn").on("click", function () {
        overlay.remove();
      });

      // Close overlay when clicking outside the content
      overlay.on("click", function (e) {
        if (e.target === overlay[0]) {
          overlay.remove();
        }
      });

      var page = 1;
      var isLoading = false;

      function loadMoreImages() {
        if (isLoading) return;
        isLoading = true;
        overlay.find(".loader").show();
        _this.fetchImages(
          provider,
          overlay.find(".image-list"),
          page++,
          function () {
            isLoading = false;
            overlay.find(".loader").hide();
          }
        );
      }

      overlay.find(".image-list-wrapper").on("scroll", function () {
        if (
          $(this).scrollTop() + $(this).innerHeight() >=
          this.scrollHeight - 10
        ) {
          loadMoreImages();
        }
      });

      _this.fetchImages(provider, overlay.find(".image-list"), page++);

      overlay.on("click", ".image-item", function () {
        var imgSrc = $(this).find("img").data("large");
        var imgDesc = $(this).find("img").attr("alt");
        var uploader = $(this).find("img").data("uploader");
        var id = $(this).find("img").data("id");
        var uploaderName = $(this).find("img").data("uploader-name");

        _this.insertImage(
          imgSrc,
          imgDesc,
          provider,
          uploader,
          uploaderName,
          id
        );
        overlay.remove();
      });

      overlay.find(".search-btn").on("click", function () {
        var query = overlay.find(".search-input").val();
        if (query.length > 2) {
          page = 1;
          overlay.find(".image-list").empty();
          _this.searchImages(
            provider,
            query,
            overlay.find(".image-list"),
            page++
          );
        }
      });
    };

    AddMediaButton.prototype.fetchImages = function (
      provider,
      $list,
      page,
      callback
    ) {
      var url = this.getApiUrl(provider, null, page);

      $.getJSON(url, function (data) {
        var html = AddMediaButton.prototype.generateHtml(provider, data);
        $list.append(html);
        if (callback) callback();
      });
    };

    AddMediaButton.prototype.searchImages = function (
      provider,
      query,
      $list,
      page,
      callback
    ) {
      var url = this.getApiUrl(provider, query, page);

      $.getJSON(url, function (data) {
        var html = AddMediaButton.prototype.generateHtml(provider, data);
        $list.append(html);
        if (callback) callback();
      });
    };

    AddMediaButton.prototype.getApiUrl = function (provider, query, page) {
      var url;
      var limit = 24;
      var offset = (page - 1) * limit;

      if (provider === "Giphy") {
        url = query
          ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=${limit}&offset=${offset}`
          : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&offset=${offset}`;
      } else if (provider === "Unsplash") {
        url = query
          ? `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=${limit}&page=${page}`
          : `https://api.unsplash.com/photos/random?count=${limit}&client_id=${UNSPLASH_ACCESS_KEY}`;
      } else if (provider === "Tenor") {
        url = query
          ? `https://tenor.googleapis.com/v2/search?q=${query}&key=${TENOR_API_KEY}&client_key=testprojectfortenorapi&limit=${limit}&pos=${offset}`
          : `https://tenor.googleapis.com/v2/featured?key=${TENOR_API_KEY}&client_key=testprojectfortenorapi&limit=${limit}&pos=${offset}`;
      }

      return url;
    };

    AddMediaButton.prototype.generateHtml = function (provider, data) {
      var html = "";
      if (provider === "Giphy" && data.data) {
        data.data.forEach(function (item) {
          var uploader = item.username
            ? `data-uploader="${item.username}"`
            : "";

          html += `
            <div class="image-item">
              <img src="${item.images.downsized_medium.url}" alt="${item.title} by ${item.username} (ID: ${item.id})" data-id=${item.id} ${uploader} data-large="${item.images.original.url}">
              <p style="font-size:14px;">${item.title}</p>
            </div>
          `;
        });
      } else if (provider === "Unsplash") {
        var items = data.results || data;

        items.forEach(function (item) {
          var uploader = item.user.username
            ? `data-uploader="${item.user.username}"`
            : "";

          var uploaderName = item.user.name
            ? `data-uploader-name="${item.user.name}"`
            : "";

          html += `
            <div class="image-item">
              <img src="${item.urls.thumb}" alt="${item.alt_description} by ${item.user.username} (ID: ${item.id})" data-id=${item.id}  ${uploader} ${uploaderName} data-large="${item.urls.small}">
              <p style="font-size:14px;">${item.alt_description}</p>
            </div>
          `;
        });
      } else if (provider === "Tenor" && data.results) {
        data.results.forEach(function (item) {
          var media = item.media_formats.nanogif;

          var largeMedia =
            item.media_formats.mediumgif.url || item.media_formats.gif.url;

          if (media && largeMedia) {
            html += `
              <div class="image-item">
                <img src="${media.url}" alt="${item.content_description} by ${
              item.user ? item.user.username : "unknown"
            } (ID: ${item.id})" data-id="${
              item.id
            }"  data-large="${largeMedia}">
                <p style="font-size:14px;">${item.content_description}</p>
              </div>
            `;
          }
        });
      }
      return html;
    };

    AddMediaButton.prototype.insertImage = function (
      imgSrc,
      imgDesc,
      provider,
      uploader,
      uploaderName
    ) {
      provider = provider.toLowerCase();

      var via;

      switch (provider) {
        case "unsplash":
          via = `<small>Photo by <a href="https://unsplash.com/@${uploader}">${uploaderName}</a> on <a href="https://unsplash.com/">Unsplash</a></small> `;
          break;

        default:
          via = `<span class="addmedia-${provider}" />`;
          break;
      }

      var alt = uploader
        ? ` alt="${imgDesc} by ${uploader}"`
        : ` alt="${imgDesc}"`;

      var img = `<img src="${imgSrc}" class="addmedia" ${alt}>`;

      // Wrap the img and via elements in a container div
      var containerHtml = `<addmedia>${img}${via}</addmedia>`;
      console.log(containerHtml);

      // Create a jQuery object for the container
      var $container = $(containerHtml);

      this.editor.focus();

      this.editor.selection.insertNode($container[0]);

      this.editor.trigger("valuechanged");
      this.editor.trigger("selectionchanged");
    };

    return AddMediaButton;
  })(Simditor.Button);

  Simditor.Toolbar.addButton(AddMediaButton);

  return AddMediaButton;
});
