# HTMEL

HTMEL is a collection of decorators for simplifying the development of web components in JavaScript or TypeScript.

## Installation

Install HTMEL via npm:

```bash
npm install htmel
```

## Usage

Import the necessary decorators from the library in your web component files:

```javascript
import { Component, Prop, Props, State, JSX } from "htmel";
```

## Example

### UserItem Component

```javascript
import { Prop, State, Props, JSX } from "htmel";

@Props(["user"])
export class UserItem {
  @Prop user: { name: string; id: number } | null;
  @State private count: number = 0;

  increment(el) {
    this.count = this.count + 1;
    el.srcElement.innerText = this.count;
  }

  renderItems() {
    const userName = this?.user?.name;

    if (userName) {
      return (
        <li
          id="user-item"
          className="user-item"
          style={{
            margin: "10px 0",
            border: "1px solid #ddd",
            padding: "10px",
          }}
        >
          {userName || "Loading..."}
        </li>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderItems()}

        <button id="incrementButton" onclick={(el) => this.increment(el)}>
          {String(this.count)}
        </button>
      </div>
    );
  }
}
```

### UserList Component

```javascript
import { Component } from "htmel";

@Component({
  tag: "user-list",
  shadow: true,
  styleUrl: "./components/userlist.css"
})
export class UserList extends HTMLElement {
  users: any[];

  constructor() {
    super();
    // Initialize the user data
    this.users = [];

    // Fetch and render users
    this.fetchAndRenderUsers();
  }

  async fetchAndRenderUsers() {
    // Mock API endpoint (replace with your actual API endpoint)
    const apiUrl = "https://jsonplaceholder.typicode.com/users";

    try {
      const response = await fetch(apiUrl);
      const users = await response.json();
      this.users = users;
      this.renderUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  renderUsers() {
    const userFragment = document.createDocumentFragment();

    this.users.forEach((user) => {
      const item = new UserItem();
      item.user = user;
      const jsx = item.render();
      userFragment.appendChild(jsx);
    });

    this.shadowRoot.appendChild(userFragment);
  }
}
```
