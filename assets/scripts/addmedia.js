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
      var tpl;
      tpl = `<ul class="custom-image-menu">
       <li data-provider="IndiaForums"> <a href="#" class="menu-item">India Forums</a> </li>
       <li data-provider="Giphy"> <a href="#" class="menu-item">Giphy</a> </li>
       <li data-provider="Tenor"> <a href="#" class="menu-item">Tenor</a> </li>
       <li data-provider="Unsplash"> <a href="#" class="menu-item">Unsplash</a> </li>
      </ul>`;

      // tpl = `<ul class="custom-image-menu">
      //   <li data-provider="IndiaForums"> <a href="#" class="menu-item">India Forums</a> </li>
      //   <li data-provider="Tenor"> <a href="#" class="menu-item">Tenor</a> </li>
      // </ul>`;
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

      switch (provider) {
        case "Giphy":
          var poweredBy = `<img src="/assets/img/powered-by-giphy.png" style="align-self:center" />`;
          break;
        case "Unsplash":
          var poweredBy = `<span style="margin:0 auto;">Powered By: <a href=""  rel="nofollow" target="_blank" ><strong>${provider}</strong></a> </span>`;
          break;
        case "Tenor":
          var poweredBy = `<img src="/assets/img/powered-by-tenor.png" style="align-self:center" />`;
          break;
        case "IndiaForums":
          var poweredBy = `<span style="margin:0 auto;">Powered By: <strong>${provider}</strong></span>`;
          break;
        default:
          var poweredBy = "";
          break;
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
            <div class="loader" style="display: none; text-align: center; padding: 10px; aspect-ratio:1/1; margin: 0 auto;"></div>
        </div>
        </div>`);
      $("body").append(overlay);

      // Focus the cursor on the search input
      overlay.find(".search-input").focus();

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
      var limit = 24;
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
          var nextPos = overlay.find(".image-list").data("nextPos");
          var query = overlay.find(".search-input").val();

          loadMoreImages(nextPos, query);
        }
      });

      _this.fetchImages(provider, overlay.find(".image-list"), page++, limit);

      overlay.on("click", ".image-item", function () {
        var imgSrc = $(this).find("img").data("large");
        var imgPageUrl = $(this).find("img").data("pageurl");
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
          id,
          imgPageUrl
        );
        overlay.remove();
      });

      overlay.find(".search-btn").on("click", function () {
        var query = overlay.find(".search-input").val();
        if (query.length > 2) {
          page = 1;
          overlay.find(".image-list").empty();

          // Initialize columns based on window width
          _this.initializeColumns(overlay.find(".image-list"));

          overlay.find(".image-list-wrapper").on("scroll", function () {
            if (
              $(this).scrollTop() + $(this).innerHeight() >=
              this.scrollHeight - 10
            ) {
              var nextPos = overlay.find(".image-list").data("nextPos");
              var query = overlay.find(".search-input").val();
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

      // Add event listener for Enter key press on search input
      overlay.find(".search-input").on("keypress", function (e) {
        if (e.which === 13) {
          // Enter key pressed
          var query = overlay.find(".search-input").val();
          if (query.length > 2) {
            page = 1;
            overlay.find(".image-list").empty();

            // Initialize columns based on window width
            _this.initializeColumns(overlay.find(".image-list"));

            overlay.find(".image-list-wrapper").on("scroll", function () {
              if (
                $(this).scrollTop() + $(this).innerHeight() >=
                this.scrollHeight - 10
              ) {
                var nextPos = overlay.find(".image-list").data("nextPos");
                var query = overlay.find(".search-input").val();
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

      // Initialize columns based on window width
      _this.initializeColumns(overlay.find(".image-list"));
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
      var url = this.getApiUrl(provider, query, page, limit, pos);

      $.getJSON(url, function (data) {
        var html = AddMediaButton.prototype.generateHtml(provider, data, limit);
        AddMediaButton.prototype.appendImagesToColumns($list, html);
        // Update pos for the next pagination request
        if (provider === "Tenor" && data.next) {
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
      var url = this.getApiUrl(provider, query, page, limit, pos);

      console.log("Search URL:", url); // Debugging log

      $.getJSON(url, function (data) {
        var html = AddMediaButton.prototype.generateHtml(provider, data, limit);

        AddMediaButton.prototype.appendImagesToColumns($list, html);
        // Update pos for the next pagination request
        if (provider === "Tenor" && data.next) {
          $list.data("nextPos", data.next);
        }

        if (callback) callback();
      });
    };

    AddMediaButton.prototype.getApiUrl = function (
      provider,
      query,
      page,
      limit,
      pos
    ) {
      var url;

      switch (provider) {
        case "Giphy":
          var offset = (page - 1) * limit;
          url = query
            ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=${limit}&offset=${offset}`
            : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&offset=${offset}`;

          // url = `/api/eximg/giphy?q=${encodeURIComponent(
          //   query || ""
          // )}&pn=${page}&ps=${limit}`;

          break;
        case "Unsplash":
          url = query
            ? `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=${limit}&page=${page}`
            : `https://api.unsplash.com/photos/random?count=${limit}&client_id=${UNSPLASH_ACCESS_KEY}`;

          // url = `/api/eximg/unsplash?q=${encodeURIComponent(
          //   query || ""
          // )}&pn=${page}&ps=${limit}`;

          break;
        case "Tenor":
          url = query
            ? `https://tenor.googleapis.com/v2/search?q=${query}&key=${TENOR_API_KEY}&client_key=testprojectfortenorapi&limit=${limit}&pos=${
                pos || ""
              }`
            : `https://tenor.googleapis.com/v2/featured?key=${TENOR_API_KEY}&client_key=testprojectfortenorapi&limit=${limit}&pos=${
                pos || ""
              }`;

          //if pos is not provided, it will be set to 0

          pos = pos || "";

          // url = `/api/eximg/tenor?q=${encodeURIComponent(
          //   query || ""
          // )}&ps=${limit}&pn=${page}&pc=${pos}`;
          // console.log(page);
          // console.log("Pos", pos);
          break;
        case "IndiaForums":
          url = `/api/eximg/ifmedia?q=${encodeURIComponent(
            query || ""
          )}&ps=${limit}&pn=${page}`;

          break;
        default:
          url = "";
          break;
      }

      console.log(url);

      return url;
    };

    AddMediaButton.prototype.generateHtml = function (provider, data, limit) {
      var html = "";
      switch (provider) {
        case "Giphy":
          if (data.data) {
            data.data.forEach(function (item) {
              var uploader = item.username
                ? `data-uploader="${item.username}"`
                : "";

              html += `<div class="image-item"><img src="${item.images.downsized_medium.url}" alt="${item.title}" data-id=${item.id} ${uploader} data-large="${item.images.original.url}"></div>`;
            });
          }
          break;
        case "Unsplash":
          var items = data.results || data;
          items.forEach(function (item) {
            var uploader = item.user.username
              ? `data-uploader="${item.user.username}"`
              : "";

            var uploaderName = item.user.name
              ? `data-uploader-name="${item.user.name}"`
              : "";

            html += `<div class="image-item"><img src="${item.urls.thumb}" alt="${item.alt_description}" data-id=${item.id}  ${uploader} ${uploaderName} data-large="${item.urls.small}"><p style="font-size:12px;">${item.alt_description}</p></div>`;
          });
          break;
        case "Tenor":
          if (data.results) {
            data.results.forEach(function (item) {
              var media = item.media_formats.nanogif;

              var largeMedia =
                item.media_formats.mediumgif.url || item.media_formats.gif.url;

              if (media && largeMedia) {
                html += `<div class="image-item"><img src="${media.url}" alt="${item.content_description}" data-id="${item.id}"  data-large="${largeMedia}"></div>`;
              }
            });
          }
          break;
        case "IndiaForums":
          if (data) {
            data.forEach(function (item) {
              if (item) {
                html += `<div class="image-item"><img src="${item.ImageUrl}" alt="${item.MediaTitle}" data-id="${item.MediaId}" data-large="${item.LargeImageUrl}" data-pageurl="${item.PageUrl}"><p style="font-size:12px;">${item.MediaTitle}</p></div>`;
              }
            });
          }
          break;
        default:
          html = "";
          break;
      }
      var imgCount = (html.match(/<img\b/g) || []).length;
      // console.log(imgCount);
      if (imgCount < limit) {
        $(".image-list-wrapper").off("scroll");
      }
      return html;
    };

    AddMediaButton.prototype.appendImagesToColumns = function ($list, html) {
      var $columns = $list.find(".image-column");
      var $items = $(html);

      $items.each(function (index, item) {
        var $column = $columns.eq(index % $columns.length);

        $column.append(item);
      });
    };

    AddMediaButton.prototype.insertImage = function (
      imgSrc,
      imgDesc,
      provider,
      uploader,
      uploaderName,
      id,
      imgPageUrl
    ) {
      provider = provider.toLowerCase();

      var via;
      var width;

      switch (provider) {
        case "unsplash":
          via = `<span class="addmedia-${provider}">Photo by <a href="https://unsplash.com/@${uploader}">${uploaderName}</a> on <a href="https://unsplash.com/">Unsplash</a></span>`;
          break;
        case "indiaforums":
          via = `<span class="addmedia-${provider}"><a href="https://www.indiaforums.com${imgPageUrl}">${imgDesc}</a></span>`;
          width = ` width = "600"`;
          break;

        default:
          via = `<span class="addmedia-${provider}" />`;
          break;
      }

      var alt = uploader
        ? ` alt="${imgDesc} by ${uploader}"`
        : ` alt="${imgDesc}"`;

      var img = `<img src="${imgSrc}" class="addmedia"${alt}${width}>`;

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
