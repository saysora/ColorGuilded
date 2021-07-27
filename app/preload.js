const { ipcRenderer } = require("electron");

let themevars = {
  main: null,
  embeds: null,
  input: null,
  server: null,
  group: null,
  channel: null,
  headerbar: null,
  userlistbg: null,
  userlist: null,
  accent: null,
  popups: null,
  emojionlysize: "24px",
  inlineemojisize: "14px",
};

document.addEventListener("readystatechange", () => {
  if (document.readyState === "interactive") {
    // get Local storage
    var ls = window.localStorage;
    // Test Color setter

    // Set if it's not already locally stored
    if (!ls.getItem("theme")) {
      ls.setItem("theme", JSON.stringify(themevars));
    }

    const theme = JSON.parse(ls.getItem("theme"));

    //After the bundle loads do stuff
    global.bundle.addEventListener("load", () => {
      var rootish = getComputedStyle(document.documentElement);
      // Create the style tag we're gonna use for themeing
      var style = document.createElement("style");
      var stylezones = document.createElement("style");
      style.id = "root";
      // Check if we have the theme in local storage
      if (ls.getItem("theme")) {
        // Create our root style tag
        let rootstring = ":root {";

        // TO DO: Make this a function on it's own
        // Loop through our theme variables
        for (const item in theme) {
          if (theme[item] !== null) {
            rootstring += `--${item}: ${theme[item]};`;
          }
        }
        // Close our string
        rootstring += "}";

        // Insert the root styles
        style.innerHTML = rootstring;
      }
      // Also minor other styles here
      stylezones.innerHTML = `
        /* Top bar */
        .ScreenHeader-container {
          background: var(--headerbar);
        }
        /* Main area */
        .ChannelWrapper-contents, .TeamPageContent-content, .OptionsMenuPageWrapper-container {
          background: var(--main);
        }
        /* Popups */
        .ChatV2MessageReplyTooltip-content-wrapper, .ChatV2MessageReplyTooltip-arrow {
          background: var(--main);
        }

        .ChannelPinnedMessages-container {
          background: var(--main);
        }

        /* Inputs */
        .ChatChannelInput-container .ChatChannelInput-editor {
          background: var(--input);
        }
        /* User list */
        .SidebarWrapper-container {
          background: var(--userlistbg);
        }

        .SidebarInfoItem-container {
          background: var(--userlist);
          margin-bottom: 14px;
        }

        /* Server channels */
        .TeamNavMenu-container {
          background: var(--channel);
        }

        /* Grouplist */

        .GroupSelector-container {
          background: var(--group);
        }

        /* Server + server search */

        .WebAppV2-minimal-nav-sidebar, .NavV4Sidebar-sidebar-footer, .NavV4Footer-footer-content {
          background-color: var(--server);
        }

        .NavV4Footer-right {
          background-color: transparent;
          border-color: var(--userlistbg);
        }

        /* Popups */
        .QuickActionBar-container, .ProfileHoverCardV2Overlay-container,.ModalV2-container {
          background: var(--popups);
        }

        .TransientMenu-container-style-default {
          background: var(--popups);
        }

        /* Reactsions and font sizes */
        .ParagraphRenderer-only-reaction {
          font-size: var(--emojionlysize);
        }
        
        /* Embeds + Other*/
        .OpenGraphEmbed-content,.TeamOverviewContentItemCard-container {
          background-color: var(--embeds);
        }

        .btn-update {
          color: #000;
          display: inline-block;
          padding: 5px 15px;
          margin: 10px 0;
          cursor: default;
          background: linear-gradient(to right, #ffb400, #e4c519, #edd75c);
          box-shadow: 0 0 6px 0 rgba(255,234,0,0.5);
        }

        .btn-update:hover {
          background-position: 99% 0;
          box-shadow: 0 0 10px 0 rgba(255,234,0,0.5);
        }

        .theme-settings-list--item label {
          display: block;
          padding: 10px 0;
        }

        .theme-settings-list--item input {
          padding: 5px;
        }

        `;

      document.head.appendChild(style);
      document.head.appendChild(stylezones);
    });

    // Create keybind for a modal to set your theme colors
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key == ".") {
        e.stopPropagation();
        if (document.querySelector("#themeModal")) {
          document.querySelector("#themeModal").remove();
        } else {
          themeModal(theme);
        }
      }
    });
  }
});

const themeModal = (theme) => {
  const tmodal = document.createElement("div");
  tmodal.id = "themeModal";
  tmodal.setAttribute(
    "style",
    "position: fixed; top: 0; left: 0; width: 100%; height: 100%;display: flex; align-items: center; justify-content: center;"
  );

  let template = `
		<div style="width: 80%; height: 80%; background: #333; color: #fff; padding: 2rem; overflow-y: auto;">
		<h1>Theme Settings</h1>
		<div class="theme-settings-list">
	`;

  for (i in themevars) {
    template += `
		<div class="theme-settings-list--item">
			<label for="${i}">${i}</label>
			<input type="text" value="${theme[i]}" id="theme-${i}" style="color: #000;" />
		</div>
		`;
  }

  template += `
		<a class="btn-update" id="updateTheme">
			Update Theme
		</a>
	`;

  template += "</div></div>";
  tmodal.innerHTML = template;

  document.body.appendChild(tmodal);
  tmodal.addEventListener("click", (e) => {
    if (e.target.closest("#updateTheme")) {
      e.stopPropagation();
      updateTheme(theme);
    }
  });
};

function updateTheme(theme) {
  var inputs = document.querySelectorAll(".theme-settings-list--item input");
  inputs.forEach((i) => {
    if (i.value !== null) {
      theme[i.id.split("-")[1]] = i.value;
    }
  });
  console.log(theme);
  window.localStorage.setItem("theme", JSON.stringify(theme));
  themeVarTag(theme, "#root", "root");
}

function themeVarTag(theme, style, name) {
  let template = ":root {";

  for (const item in theme) {
    if (theme[item] !== null) {
      template += `--${item}: ${theme[item]};`;
    }
  }

  template += "}";

  if (style) {
    var thestyle = document.querySelector(style);
    thestyle.remove();
    thestyle = document.createElement("style");
    thestyle.id = name;
    thestyle.innerHTML = template;
    document.head.appendChild(thestyle);
  }
}

const preload = ipcRenderer.sendSync("MEGUILDED_GET_PRELOAD");

if (preload) {
  require(preload);
}
