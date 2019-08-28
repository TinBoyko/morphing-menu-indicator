# Morphing menu indicator

## Live Playground

To run that demo on your own computer:

- Clone this repository
- `yarn`
- Visit `http://localhost:3000/`

## Usage

```html
...
<div class="navigation">
  <nav role="navigation" class="nav-menu">
    <a href="#" class="nav-link active" style="max-width: 940px;">Home</a>
    <a href="#" class="nav-link" style="max-width: 940px;">About</a>
    <a href="#" class="nav-link" style="max-width: 940px;">Contact</a>
  </nav>
  <button class="mobile-toggle">
    <span></span>
    <span></span>
    <span></span>
  </button>
</div>
...
<script>
  const defaultParams = {
    activeMenuItemClass: "active",
    color: "#e5242d",
    menuItemClass: "nav-link",
    extend: [1.2, 1],
    speed: 300
  };
  new MorphingMenuIndicator("nav-menu", defaultParams);
</script>
```
