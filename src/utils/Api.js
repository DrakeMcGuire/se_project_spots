class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

    // create another method, getUserInfo(different base url)
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
  headers: this._headers,
})
  .then((res) => {
    if(res.ok) {
      return res.json()
    }
    Promise.reject(`Error: ${res.status}`);
  });
  }

  getAppInfo() {
    // call getUserInfo in this array
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
  headers: this._headers,
})
  .then((res) => {
    if(res.ok) {
      return res.json()
    }
    Promise.reject(`Error: ${res.status}`);
  });
  }

  // TODO - Implement Post /cards similar to below

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        name,
        about,
      }),
    })
    .then((res) => {
    if(res.ok) {
      return res.json()
    }
    Promise.reject(`Error: ${res.status}`);
  });
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    })
    .then((res) => {
    if(res.ok) {
      return res.json()
    }
    Promise.reject(`Error: ${res.status}`);
  });
  }

  editAvaterInfo(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar
      }),
    })
    .then((res) => {
    if(res.ok) {
      return res.json()
    }
    Promise.reject(`Error: ${res.status}`);
  });
  }
}
export default Api;