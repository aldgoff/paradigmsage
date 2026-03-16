/dev/3dc-arch.md

# Files to Add

## assets/3dc/js/main.js
  // ./assets/3dc/js/main.js

  <!-- import { initController } from "./controller/controller.js"; -->

  console.log("main.js: 3dc/js/main.js");

  <!-- initController(); -->

  if (import.meta.env?.DEV ?? true) { // Regression tests of the model.
    <!-- import("./tests/addSpookyMove.test.js"); -->
  }

  console.log("--------------------");

## content/3dc/_index.md
  ---
  title: "3D Chess"
  ---

  This version of 3D chess uses planar moves and advancement squares.
  It claims that w/o these two paradigm busting concepts, play in 3D cannot feel like chess.

## content/3dc/rationale.md
  Brief justification for this variant.
  Ensures a non empty nav panel.

# Files to Change

## layouts/_default/baseof.html
  Add this line
    ```(dict "name" "3D Chess"             "path" "3dc/")```  
  to this file in this place...

  <!-- PoP page and nav. -->
  <body style="margin:0; font-family: system-ui, -apple-system, sans-serif; line-height: 1.3;">
    <header style="border-bottom:1px solid #ddd; padding:0.75rem 1rem;">
      <nav style="max-width: 72rem; margin: 0 auto; display:flex; gap:1rem; align-items:baseline; flex-wrap:wrap;">
        <a href="{{ site.Home.RelPermalink }}" style="font-weight:700; text-decoration:none; color:inherit;">
          {{ site.Title }}
        </a>

        <span style="opacity:0.35;">|</span>

        {{ $p := .RelPermalink }}
        {{ $items := slice
          (dict "name" "Start Here"           "path" "start-here/")
          (dict "name" "Paradigm of Paradox"  "path" "pop/")
          (dict "name" "Instruments"          "path" "instrument/")
          (dict "name" "QT3"                  "path" "qt3/")
          (dict "name" "Contact"              "path" "contact/")
        }}

## layouts/partials/3dc/nav.html
  <nav>
    {{ $current := .RelPermalink }}

    {{ range .CurrentSection.Pages.ByWeight }}
      {{ $active := eq .RelPermalink $current }}

      <div style="margin-bottom:0.4rem;">
        <a href="{{ .RelPermalink }}"
          title="{{ .Title }}"
          style="
            text-decoration:none;
            color:inherit;
            {{ if $active }}font-weight:600;{{ else }}opacity:0.8;{{ end }}
          ">
          {{ .Title }}
        </a>
      </div>

    {{ end }}

  </nav>

## layouts/3dc/list.html
  {{ define "main" }}

    <div style="display:flex; gap:2rem;">

      <aside style="width:12rem; flex-shrink:0; font-size:0.9rem;">
        {{ partial "3dc/nav.html" . }}
      </aside>

      <section style="flex:1; min-width:0; max-width:70ch;">
        {{ .Content }}
      </section>

    </div>

  {{ end }}

## layouts/3dc/single.html
  {{ define "main" }}

    <div style="display:flex; gap:2rem;">

      <aside style="width:12rem; flex-shrink:0; font-size:0.9rem;">
        {{ partial "3dc/nav.html" . }}
      </aside>

      <section style="flex:1; min-width:0; max-width:86ch;">
        {{ .Content }}

        {{/* Avoid cache churn. */}}
        {{ $js := resources.Get "3dc/js/main.js" | js.Build | fingerprint }}
        <script type="module" src="{{ $js.RelPermalink }}"></script>
      </section>

    </div>

  {{ end }}

