(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define("simditor-unsplash", ["jquery", "simditor"], function (a0, b1) {
      return (root["UnsplashButton"] = factory(a0, b1));
    });
  } else if (typeof exports === "object") {
    module.exports = factory(require("jquery"), require("simditor"));
  } else {
    root["SimditorUnsplash"] = factory(root["jQuery"], root["Simditor"]);
  }
})(this, function ($, Simditor) {
  var UnsplashButton,
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice,
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

  UnsplashButton = (function (_super) {
    __extends(UnsplashButton, _super);

    UnsplashButton.i18n = {
      "zh-CN": {
        unsplash: "Unsplash 图片",
      },
      "en-US": {
        unsplash: "Unsplash Image",
      },
    };

    UnsplashButton.prototype.name = "unsplash";
    UnsplashButton.prototype.icon = "picture-o";
    UnsplashButton.prototype.menu = true;

    function UnsplashButton() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      UnsplashButton.__super__.constructor.apply(this, args);
    }

    UnsplashButton.prototype.renderMenu = function () {
      var $list, tpl;
      tpl =
        '<div class="unsplash-menu">' +
        '<input type="text" class="search-input" placeholder="Search Unsplash...">' +
        '<div class="image-list"></div>' +
        "</div>";
      this.menuWrapper.html(tpl);
      $list = this.menuWrapper.find(".image-list");
      this.loadRandomImages($list);

      this.menuWrapper.on(
        "input",
        ".search-input",
        (function (_this) {
          return function (e) {
            var query = $(e.currentTarget).val();
            if (query.length > 2) {
              _this.searchImages(query, $list);
            }
          };
        })(this)
      );

      return $list.on(
        "mousedown",
        "div",
        (function (_this) {
          return function (e) {
            var $img;
            _this.wrapper.removeClass("menu-on");
            if (!_this.editor.inputManager.focused) {
              return;
            }
            $img = $(e.currentTarget).find("img").clone();
            _this.editor.selection.insertNode($img);
            _this.editor.trigger("valuechanged");
            _this.editor.trigger("selectionchanged");
            return false;
          };
        })(this)
      );
    };

    UnsplashButton.prototype.loadRandomImages = function ($list) {
      var unsplashUrl =
        // "https://api.unsplash.com/photos/random?count=3&client_id=S6dwtFdIjNtre8yyA2IJ2DVv84nGFyGPFmg-WO7FnXQ";
        "/unsplash.json";
      $.getJSON(unsplashUrl, function (data) {
        var html = "";
        data.forEach(function (photo) {
          html += `
            <div class="image-item">
                <img src="${photo.urls.thumb}" alt="${photo.alt_description}">
                <p style="font-size:.75rem;">${photo.alt_description}</p>
            </div>
            `;
        });
        $list.html(html);
      });
    };

    UnsplashButton.prototype.searchImages = function (query, $list) {
      var unsplashUrl =
        // "https://api.unsplash.com/search/photos?query=" +
        // query +
        // "&client_id=S6dwtFdIjNtre8yyA2IJ2DVv84nGFyGPFmg-WO7FnXQ";
        "/unsplash.json?query=" + query;
      $.getJSON(unsplashUrl, function (data) {
        var html = "";
        data.results.forEach(function (photo) {
          html +=
            '<div><img src="' +
            photo.urls.thumb +
            '" alt="' +
            photo.alt_description +
            '"></div>';
        });
        $list.html(html);
      });
    };

    return UnsplashButton;
  })(Simditor.Button);

  Simditor.Toolbar.addButton(UnsplashButton);

  return UnsplashButton;
});
