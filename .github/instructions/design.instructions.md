---
description: This file describes the design guidelines for the project.
applyTo: "**"
---

# Design Guidelines

- When creating a new class in scss files, keep descendents nested within the parent class. For example, if you have a class called `.parent`, and you want to create a child class called `__child`, you would write it like this (always use double underscores for child classes):

```scss
.parent {
  &__child {
    // styles for the child class
  }
}
```
