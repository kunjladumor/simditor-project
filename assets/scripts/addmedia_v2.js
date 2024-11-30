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
  const PIXABAY_API_KEY = "47351696-186299b296792d6c30a2a7826";

  class Provider {
    constructor(name) {
      this.name = name;
    }

    getPoweredBy() {
      return "";
    }

    getApiUrl(query, page, limit, pos) {
      return "";
    }

    generateHtml(data, limit) {
      return "";
    }

    insertImage(imgSrc, imgDesc, uploader, uploaderName, id, imgPageUrl) {
      return `<img src="${imgSrc}" alt="${imgDesc}">`;
    }
  }

  class GiphyProvider extends Provider {
    constructor() {
      super("Giphy");
    }

    getPoweredBy() {
      return `<img src="/assets/img/powered-by-giphy.png" style="align-self:center" />`;
    }

    getApiUrl(query, page, limit, pos) {
      const offset = (page - 1) * limit;
      return query
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=${limit}&offset=${offset}`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&offset=${offset}`;
    }

    generateHtml(data, limit) {
      let html = "";
      if (data.data) {
        data.data.forEach(function (item) {
          const uploader = item.username
            ? `data-uploader="${item.username}"`
            : "";
          html += `<div class="image-item"><img src="${item.images.downsized_medium.url}" alt="${item.title}" data-id=${item.id} ${uploader} data-large="${item.images.original.url}"></div>`;
        });
      }
      return html;
    }

    insertImage(imgSrc, imgDesc, uploader, uploaderName, id, imgPageUrl) {
      const via = `<span class="addmedia-giphy"></span>`;
      return `<addmedia><img src="${imgSrc}" class="addmedia" alt="${imgDesc}">${via}</addmedia>`;
    }
  }

  class UnsplashProvider extends Provider {
    constructor() {
      super("Unsplash");
    }

    getPoweredBy() {
      return `<span style="margin:0 auto;">Powered By: <a href=""  rel="nofollow" target="_blank" ><strong>${this.name}</strong></a> </span>`;
    }

    getApiUrl(query, page, limit, pos) {
      return query
        ? `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=${limit}&page=${page}`
        : `https://api.unsplash.com/photos/random?count=${limit}&client_id=${UNSPLASH_ACCESS_KEY}`;
    }

    generateHtml(data, limit) {
      let html = "";
      const items = data.results || data;
      items.forEach(function (item) {
        const uploader = item.user.username
          ? `data-uploader="${item.user.username}"`
          : "";
        const uploaderName = item.user.name
          ? `data-uploader-name="${item.user.name}"`
          : "";
        const downloadLink = item.links.download_location;
        html += `<div class="image-item"><img src="${item.urls.thumb}" alt="${item.alt_description}"  data-id=${item.id}  ${uploader} data-download-link=${downloadLink} ${uploaderName} data-large="${item.urls.small}"><p style="font-size:12px;">${item.alt_description}</p></div>`;
      });
      return html;
    }

    insertImage(imgSrc, imgDesc, uploader, uploaderName, id, imgPageUrl) {
      const via = `<span class="addmedia-unsplash">Photo by <a href="https://unsplash.com/@${uploader}">${uploaderName}</a> on <a href="https://unsplash.com/">Unsplash</a></span>`;
      return `<addmedia><img src="${imgSrc}" class="addmedia" alt="${imgDesc} by ${uploader}">${via}</addmedia>`;
    }
  }

  class TenorProvider extends Provider {
    constructor() {
      super("Tenor");
    }

    getPoweredBy() {
      return `<img src="/assets/img/powered-by-tenor.png" style="align-self:center" />`;
    }

    getApiUrl(query, page, limit, pos) {
      return query
        ? `https://tenor.googleapis.com/v2/search?q=${query}&key=${TENOR_API_KEY}&client_key=testprojectfortenorapi&limit=${limit}&pos=${
            pos || ""
          }`
        : `https://tenor.googleapis.com/v2/featured?key=${TENOR_API_KEY}&client_key=testprojectfortenorapi&limit=${limit}&pos=${
            pos || ""
          }`;
    }

    generateHtml(data, limit) {
      let html = "";
      if (data.results) {
        data.results.forEach(function (item) {
          const media = item.media_formats.nanogif;
          const largeMedia =
            item.media_formats.mediumgif.url || item.media_formats.gif.url;
          if (media && largeMedia) {
            html += `<div class="image-item"><img src="${media.url}" alt="${item.content_description}" data-id="${item.id}"  data-large="${largeMedia}"></div>`;
          }
        });
      }
      return html;
    }

    insertImage(imgSrc, imgDesc, uploader, uploaderName, id, imgPageUrl) {
      const via = `<span class="addmedia-tenor"></span>`;
      return `<addmedia><img src="${imgSrc}" class="addmedia" alt="${imgDesc}">${via}</addmedia>`;
    }
  }

  class IndiaForumsProvider extends Provider {
    constructor() {
      super("IndiaForums");
    }

    getPoweredBy() {
      return `<span style="margin:0 auto;">Powered By: <strong>${this.name}</strong></span>`;
    }

    getApiUrl(query, page, limit, pos) {
      return `https://beta.indiaforums.com/api/eximg/ifmedia?q=${encodeURIComponent(
        query || ""
      )}&ps=${limit}&pn=${page}`;
    }

    generateHtml(data, limit) {
      let html = "";
      if (data) {
        data.forEach(function (item) {
          if (item) {
            html += `<div class="image-item"><img src="${item.ImageUrl}" alt="${item.MediaTitle}" data-id="${item.MediaId}" data-large="${item.LargeImageUrl}" data-pageurl="${item.PageUrl}"><p style="font-size:12px;">${item.MediaTitle}</p></div>`;
          }
        });
      }
      return html;
    }

    insertImage(imgSrc, imgDesc, imgPageUrl) {
      const via = `<span class="addmedia-indiaforums"><a href="https://www.indiaforums.com${imgPageUrl}">${imgDesc}</a></span>`;
      return `<addmedia><img src="${imgSrc}" class="addmedia" alt="${imgDesc}">${via}</addmedia>`;
    }
  }

  class PixabayProvider extends Provider {
    constructor() {
      super("Pixabay");
    }

    getPoweredBy() {
      return "";
    }

    getApiUrl(query, page, limit, pos) {
      var url = query
        ? `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
            query
          )}&image_type=photo&per_page=${limit}&page=${page}`
        : `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&image_type=photo&per_page=${limit}&page=${page}`;
      console.log(url);

      return url;
    }

    generateHtml(data, limit) {
      let html = "";
      if (data.hits) {
        data.hits.forEach(function (hit) {
          hit.webformatURL = hit.webformatURL.replace("_640", "_340");
          hit.largeImageURL = hit.largeImageURL.replace("_1280", "_640");
          html += `<div class="image-item"><img src="${hit.webformatURL}" data-large="${hit.largeImageURL}" data-pageurl="${hit.pageURL}" alt="${hit.tags}" data-uploader="${hit.user}" data-id="${hit.id}" data-uploader-name="${hit.user}"><div class="attribution">Photo by <a href="https://pixabay.com/users/${hit.user}-${hit.user_id}" target="_blank">${hit.user}</a> on <a href="https://pixabay.com/" target="_blank">Pixabay</a></div></div>`;
        });
      }
      return html;
    }

    insertImage(imgSrc, imgDesc, uploader, uploaderName, id, imgPageUrl) {
      const via = `<span class="addmedia-pixabay">Photo by <a href="https://pixabay.com/users/${uploader}-${id}" target="_blank">${uploader}</a> on <a href="https://pixabay.com/" target="_blank">Pixabay</a></span>`;
      const serverUrl = "/download-image"; // URL to your server endpoint for downloading images

      // Send the image to the server for downloading
      fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imgSrc: imgSrc,
          imgDesc: imgDesc,
          uploader: uploader,
          uploaderName: uploaderName,
          id: id,
          imgPageUrl: imgPageUrl,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Image downloaded successfully:", data);
        })
        .catch((error) => {
          console.error("Error downloading image:", error);
        });

      return `<addmedia><img src="${imgSrc}" class="addmedia" alt="${imgDesc}">${via}</addmedia>`;
    }
  }

  // Mapping of provider names to their respective classes
  const PROVIDERS = {
    IndiaForums: IndiaForumsProvider,
    Giphy: GiphyProvider,
    Tenor: TenorProvider,
    Unsplash: UnsplashProvider,
    Pixabay: PixabayProvider,
  };

  AddMediaButton = (function (_super) {
    __extends(AddMediaButton, _super);

    AddMediaButton.i18n = {
      "zh-CN": {
        addMedia: "Add Media",
      },
      "en-US": {
        addMedia: "Add Media",
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
      let tpl = '<ul class="custom-image-menu">';
      for (const provider in PROVIDERS) {
        tpl += `<li data-provider="${provider}"> <a href="#" class="menu-item">${provider}</a> </li>`;
      }
      tpl += "</ul>";

      this.menuWrapper.html(tpl);

      this.menuWrapper.on(
        "click",
        "li",
        (function (_this) {
          return function (e) {
            const provider = $(e.currentTarget).data("provider");
            _this.openOverlay(provider);
          };
        })(this)
      );
    };

    AddMediaButton.prototype.openOverlay = function (providerName) {
      const _this = this;
      const ProviderClass = PROVIDERS[providerName] || Provider;
      const provider = new ProviderClass();

      const poweredBy = provider.getPoweredBy();

      const overlay = $(`
        <div class="custom-image-overlay">
          <div class="overlay-content">
            <span class="close-btn">&times;</span>
            <h3>${provider.name} Image Selector</h3>
            <div class="search-container">
              <input type="text" class="search-input" placeholder="Search ${provider.name}..." />
              <button class="search-btn">Search</button>
            </div>
            ${poweredBy}
            <div class="image-list-wrapper">
              <div class="image-list"></div>
            </div>
            <div class="loader" style="display: none; text-align: center; padding: 10px; aspect-ratio:1/1; margin: 0 auto;"></div>
          </div>
        </div>
      `);
      $("body").append(overlay);

      overlay.find(".search-input").focus();

      overlay.find(".close-btn").on("click", function () {
        overlay.remove();
      });

      overlay.on("click", function (e) {
        if (e.target === overlay[0]) {
          overlay.remove();
        }
      });

      let page = 1;
      let isLoading = false;
      const limit = 24;

      function loadMoreImages(pos, query) {
        if (isLoading) return;
        isLoading = true;
        overlay.find(".loader").show();
        _this.fetchImages(
          provider,
          overlay.find(".image-list"),
          page++,
          limit,
          pos,
          query,
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
          const nextPos = overlay.find(".image-list").data("nextPos");
          const query = overlay.find(".search-input").val();
          loadMoreImages(nextPos, query);
        }
      });

      _this.fetchImages(provider, overlay.find(".image-list"), page++, limit);

      overlay.on("click", ".image-item", function () {
        const imgSrc = $(this).find("img").data("large");
        const imgPageUrl = $(this).find("img").data("pageurl");
        const imgDesc = $(this).find("img").attr("alt");
        const uploader = $(this).find("img").data("uploader");
        const id = $(this).find("img").data("id");
        const uploaderName = $(this).find("img").data("uploader-name");
        const downloadLocation = $(this).find("img").data("download-link");

        if (downloadLocation) {
          fetch(downloadLocation + "?client_id=" + UNSPLASH_ACCESS_KEY)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to trigger download");
              }
              console.log("Download triggered successfully");
            })
            .catch((error) => {
              console.error("Error triggering download:", error);
            });
        }

        const imgHtml = provider.insertImage(
          imgSrc,
          imgDesc,
          uploader,
          uploaderName,
          id,
          imgPageUrl
        );
        _this.insertImage(imgHtml, provider.name);

        overlay.remove();
      });

      overlay.find(".search-btn").on("click", function () {
        const query = overlay.find(".search-input").val();
        if (query.length > 2) {
          page = 1;
          overlay.find(".image-list").empty();
          _this.initializeColumns(overlay.find(".image-list"));
          overlay.find(".image-list-wrapper").on("scroll", function () {
            if (
              $(this).scrollTop() + $(this).innerHeight() >=
              this.scrollHeight - 10
            ) {
              const nextPos = overlay.find(".image-list").data("nextPos");
              const query = overlay.find(".search-input").val();
              loadMoreImages(nextPos, query);
            }
          });
          _this.searchImages(
            provider,
            query,
            overlay.find(".image-list"),
            page++,
            limit
          );
        }
      });

      overlay.find(".search-input").on("keypress", function (e) {
        if (e.which === 13) {
          const query = overlay.find(".search-input").val();
          if (query.length > 2) {
            page = 1;
            overlay.find(".image-list").empty();
            _this.initializeColumns(overlay.find(".image-list"));
            overlay.find(".image-list-wrapper").on("scroll", function () {
              if (
                $(this).scrollTop() + $(this).innerHeight() >=
                this.scrollHeight - 10
              ) {
                const nextPos = overlay.find(".image-list").data("nextPos");
                const query = overlay.find(".search-input").val();
                loadMoreImages(nextPos, query);
              }
            });
            _this.searchImages(
              provider,
              query,
              overlay.find(".image-list"),
              page++,
              limit
            );
          }
        }
      });

      _this.initializeColumns(overlay.find(".image-list"));
    };

    AddMediaButton.prototype.insertImage = function (imgHtml, providerName) {
      const ProviderClass = PROVIDERS[providerName] || Provider;
      const provider = new ProviderClass();

      const $container = $(imgHtml);

      this.editor.focus();
      this.editor.selection.insertNode($container[0]);
      this.editor.trigger("valuechanged");
      this.editor.trigger("selectionchanged");
    };

    AddMediaButton.prototype.initializeColumns = function ($list) {
      var columns = $(window).width() >= 768 ? 3 : 2;
      for (var i = 0; i < columns; i++) {
        $list.append(
          '<div class="image-column" style="flex: 1; display: flex; flex-direction: column;"></div>'
        );
      }
    };

    AddMediaButton.prototype.fetchImages = function (
      provider,
      $list,
      page,
      limit,
      pos,
      query,
      callback
    ) {
      var url = provider.getApiUrl(query, page, limit, pos);

      $.getJSON(url, function (data) {
        var html = provider.generateHtml(data, limit);
        AddMediaButton.prototype.appendImagesToColumns($list, html);

        // Update pos for the next pagination request
        if (provider instanceof TenorProvider && data.next) {
          $list.data("nextPos", data.next);
        }

        if (callback) callback();
      });
    };

    AddMediaButton.prototype.searchImages = function (
      provider,
      query,
      $list,
      page,
      limit,
      pos,
      callback
    ) {
      var url = provider.getApiUrl(query, page, limit, pos);

      $.getJSON(url, function (data) {
        var html = provider.generateHtml(data, limit);
        AddMediaButton.prototype.appendImagesToColumns($list, html);

        // Update pos for the next pagination request
        if (provider instanceof TenorProvider && data.next) {
          $list.data("nextPos", data.next);
          console.log($list.data("nextPos"));
        }

        if (callback) callback();
      });
    };

    AddMediaButton.prototype.appendImagesToColumns = function ($list, html) {
      var $columns = $list.find(".image-column");
      var $items = $(html);

      $items.each(function (index, item) {
        var $column = $columns.eq(index % $columns.length);

        $column.append(item);
      });
    };

    return AddMediaButton;
  })(Simditor.Button);

  Simditor.Toolbar.addButton(AddMediaButton);

  return AddMediaButton;
});
