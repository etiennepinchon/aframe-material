# A-Frame Material Kit 👽

This is real! WebVR is getting even better!
Inputs, keyboard, buttons, checkboxes, radio buttons, switches, forms, toasts and more - following the Google Material design guideline for [A-Frame](https://aframe.io).
It is perfect for room-scale webVR apps. 👌

![](static/screenshot.png)

## Demo

#### [👉👉 Live demo 😎 👈👈](https://etiennepinchon.github.io/aframe-material/)

Looks surreal if you have a headset! :)

## Getting Started

Here is the code from the demo. That is it. Pure html!

```html
<a-entity laser-controls="hand: right"></a-entity>

<!-- BEGIN INPUTS/KEYBOARD -->
<a-keyboard></a-keyboard>
<a-input position="-0.7 1 -2.5" placeholder="Username" color="black" width="1"></a-input>
<a-input position="-0.7 0.8 -2.5" type="password" placeholder="Password" color="black" width="1"></a-input>
<!-- END INPUTS/KEYBOARD -->

<!-- BEGIN FORM -->
<a-rounded position="0.5 0.5 -2.5" width="4" height="3.1" radius="0.05" rotation="0 -20 0" scale="0.3 0.3 0.3">
  <a-form>
    <a-switch position="0.2 2.7 0" enabled="true"></a-switch>
    <a-radio position="0.2 2.4 0" width="3" name="food" label="Burger with fries and pizza" value="pizza"></a-radio>
    <a-radio position="0.2 2.1 0" width="3" name="food" label="Veggies" checked="true" disabled="true"></a-radio>
    <a-radio position="0.2 1.8 0" width="3" name="food" label="Ice cream"></a-radio>
    <a-checkbox position="0.2 1.5 0" width="3" name="stuff" label="I am a checkbox" checked="true"></a-checkbox>
    <a-checkbox position="0.2 1.2 0" width="3" name="stuff" label="And I am another one" checked="true" disabled="true"></a-checkbox>
    <a-button position="0.2 0.8 0" name="stuff" value="Click me" type="raised"></a-button>
    <a-button position="0.2 0.35 0" width="3" name="stuff" value="You cannot click me" disabled="true"></a-button>
  </a-form>
</a-rounded>
<!-- END FORM -->

<!-- BEGIN TOAST -->
<a-toast message="This is a toast" action="Got it"></a-toast>
<!-- END TOAST -->
```

## 👉👉 Install 👈👈

Since this kit is using assets (icons and sounds) you need to download the git project and copy the `assets` folder to the location of your choice and specify the path in the head of the html page.

```html
<head>
  <!--  
    ... MORE HEAD STUFF ...
  -->
  <script src="https://aframe.io/releases/0.6.1/aframe.min.js"></script>
  <script src="./js/aframe-material.js"></script>
  <script type="text/javascript">
    AFRAME.ASSETS_PATH = "./assets";
  </script>
</head>
```

## Documentation 🙌

## a-keyboard ⌨️

Create a virtual keyboard that works with inputs out of the box.

```html
<a-keyboard></a-keyboard>
```

### Attributes

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| is-open | Whether or not the keyboard should be open | boolean | false |

### Methods

| Name | Description |
| --- | --- |
| show() | Display the keyboard without any animations. |
| hide() | Hide the keyboard without any animations. |
| open() | Open the keyboard smoothly. |
| dismiss() | Close the keyboard smoothly. |
| destroy() | Remove the keyboard from the scene. |

### Events

| Name | Description |
| --- | --- |
| didopen | Triggered when the keyboard did open. |
| diddismiss | Triggered when the keyboard did close. |
| input | Triggered when a key is pressed. |
| backspace | Triggered when the backspace key is pressed. |

### Custom example (just in case 😉)

```javascript
let keyboard = document.querySelector("a-keyboard");
keyboard.open();
keyboard.addEventListener('input', (e)=>{
  str += e.detail;
  console.log(str);
});
keyboard.addEventListener('dismiss', (e)=>{
  console.log("Dismiss: ", e);
  keyboard.dismiss();
});
keyboard.addEventListener('backspace', (e)=>{
  str = str.slice(0, -1);
  console.log(str);
});
```

## a-input

Create a single line text input that work with the `<a-keyboard>`.

```html
<a-input position="-1.25 2.1 -5" placeholder="Username" color="black" scale="2 2 2" width="1"></a-input>
```

### Attributes

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| value | Value of the field. | string | "" |
| name | Name of the field. | string | "" |
| disabled | Whether or not the input should be disabled. | boolean | false |
| color | Text color. | color | "#000" |
| font | Text font | string. | "default" |
| opacity | Input opacity. | number | 1 |
| placeholder | Value of the placeholder. | string | "" |
| placeholder-color | Text color of the placeholder. | color | "#AAA" |
| max-length | Limit the number of characters. | int | 0 (Infinite) |
| type | Can be either "text" or "password". | string | "text" |
| width | Width of the input. | number | 1 |
| cursor-width | Width of the cursor. | number | 0.01 |
| cursor-height | Height of the cursor. | number | 0.08 |
| cursor-color | Color of the cursor. | color | "#007AFF" |
| background-color | Color of the field. | color | "#FFF" |
| background-opacity | Opacity of the field background only. | number | 1 |

### Methods

| Name | Description |
| --- | --- |
| focus() | Focus the input. |
| blur() | Blur the input. |

### Events

| Name | Description |
| --- | --- |
| focus | Triggered when the input is focused. |
| blur | Triggered when the input is blurred. |
| change | Triggered when the value of the input changed. |

## <a-button>

Create a button (can be raised of flat).

```html
<a-button position="0 0.8 2" value="Click me" type="raised"></a-button>
```

### Attributes

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| value | Value of the button. | string | "Button" |
| name | Name of the button. | string | "" |
| disabled | Whether or not the button should be disabled. | boolean | false |
| type | Can be either "raised" or "flat". | string | "raised" |
| color | Text color. | color | "#FFF" |
| button-color | Color of the button. | color | "#4076fd" |
| font | Text font | string. | "default" |
| opacity | Input opacity. | number | 1 |
| width | Width of the input. | number | 1 |

### Events

| Name | Description |
| --- | --- |
| change:width | Triggered when the width of the button changed. |

## a-form

Create a form to get the same html `<form>` behaviors with `<a-input>`, `<a-radio>`, `<a-button>`, `<a-switch>`, `<a-checkbox>`.

```html
<a-form></a-form>
```

## a-radio

Create a radio button.

```html
<a-radio position="0 0.8 2" width="3" name="food" label="Burger with fries and pizza" value="pizza"></a-radio>
```

### Attributes

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| checked | Whether or not the radio button should be checked. | boolean | false |
| value | Value of the radio button. | string | "" |
| name | Name of the radio button. | string | "" |
| disabled | Whether or not the button should be disabled. | boolean | false |
| label | Text following the radio button (totally optional). | string | "" |
| color | Text color of the label. | color | "#757575" |
| radio-button | Color of the radio button when unchecked. | color | "#757575" |
| radio-color-checked | Color of the radio button when checked. | color | "#4076fd" |
| font | Text font | string. | "default" |
| opacity | Input opacity. | number | 1 |
| width | Width of the input. | number | 1 |

### Events

| Name | Description |
| --- | --- |
| change | Triggered when the value of the radio button changed. |

## a-checkbox

Create a checkbox.

```html
<a-checkbox position="0 0.8 2" width="3" name="stuff" label="I am a checkbox" checked="true"></a-checkbox>
```

### Attributes

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| checked | Whether or not the checkbox should be checked. | boolean | false |
| value | Value of the checkbox. | string | "" |
| name | Name of the checkbox. | string | "" |
| disabled | Whether or not the checkbox should be disabled. | boolean | false |
| label | Text following the checkbox (totally optional). | string | "" |
| color | Text color of the label. | color | "#757575" |
| radio-button | Color of the checkbox when unchecked. | color | "#757575" |
| radio-color-checked | Color of the checkbox when checked. | color | "#4076fd" |
| font | Text font | string. | "default" |
| opacity | Input opacity. | number | 1 |
| width | Width of the input. | number | 1 |

### Events

| Name | Description |
| --- | --- |
| change | Triggered when the value of the checkbox changed. |


## a-switch

Create a switch button that can be toggle on/off.

```html
<a-switch position="0 0.8 2" enabled="true"></a-switch>
```

### Attributes

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| enabled | Whether or not the switch should be enabled. | boolean | false |
| name | Name of the checkbox. | string | "" |
| disabled | Whether or not the switch should be disabled. | boolean | false |
| fill-color | Color of the fill when off. | color | "#bababa" |
| knob-color | Color of the knob when off. | color | "#f5f5f5" |
| fill-color-enabled | Color of the fill when on. | color | "#80a8ff" |
| knob-color-enabled | Color of the knob when on. | color | "#4076fd" |
| fill-color-disabled | Color of the fill when disabled. | color | "#939393" |
| knob-color-disabled | Color of the knob when disabled. | color | "#a2a2a2" |

### Events

| Name | Description |
| --- | --- |
| change | Triggered when the switch is toggled. |


## a-toast

Create a toast to alert the user of something.

```html
<a-toast message="This is a toast" action="Got it"></a-toast>
```

### Attributes

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| message | Text shown by the toast. | string | "You are cool" |
| action | Text of the button (optional). | string | "" |
| color | Text color. | color | "#FFF" |
| background-color | Color of the toast. | color | "#4076fd" |
| font | Text font | string. | "default" |
| width | Width of the input. | number | 1 |
| duration | Duration of the toast | number | 2000 (2sec) |
| autoshow | Whether the toast should show right away. | boolean | true |

### Events

| Name | Description |
| --- | --- |
| actionclick | Triggered when the action is clicked. |

### Custom example (just in case 😉)

```javascript
let button = document.querySelector('a-button');
let toast = document.querySelector('a-toast');
toast.addEventListener('actionclick', ()=>{
  toast.hide();
})
button.addEventListener('click', ()=> {
  toast.show();
})
```

## <a-rounded>

Create a rounded rectangle, useful to create beautiful interfaces 😁.

[👉 github.com/etiennepinchon/aframe-rounded](https://github.com/etiennepinchon/aframe-rounded)

## Want to make some changes to it?

### Installation

First make sure you have Node installed.

On Mac OS X, it's recommended to use [Homebrew](http://brew.sh/) to install Node + [npm](https://www.npmjs.com):

    brew install node

To install the Node dependencies:

    npm install

### Local Development

To serve the site from a simple Node development server:

    npm start

Then launch the site from your favorite browser:

[__http://localhost:3333/__](http://localhost:3333/)

## License

Distributed under an [MIT License](LICENSE).

Made by Etienne Pinchon (@etiennepinchon) - September 2017.
