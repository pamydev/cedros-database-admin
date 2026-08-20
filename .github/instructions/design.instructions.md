---
description: This file describes the design guidelines for the project.
applyTo: "**"
---

# Design Guidelines

- When creating a new class in scss files, keep descendants nested within the parent class. For example, if you have a class called `.parent`, and you want to create a child class called `__child`, you would write it like this (always use double underscores for child classes):

```scss
.parent {
  .__child {
    // styles for the child class
  }
}
```

- Do not create new css variables. Use the existing ones in `main.scss`. Use color-mix to create new colors based on existing ones. For example, if you want to create a new color that is a mix of two existing colors, you can do it like this:

```scss
.new-color {
  color: color-mix(
    in srgb,
    var(--existing-color-1) 50%,
    var(--existing-color-2) 50%
  );
  // or transparentize the color if you want to make it more transparent with color-mix
  background-color: color-mix(
    in srgb,
    var(--existing-color-1) 30%,
    transparent
  );
}
```
