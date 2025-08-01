import "./index.css";
import logo from "../images/Logo.svg";
import pencilIcon from "../images/pencil.svg";
import plusIcon from "../images/plus.svg";

import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButttonText } from "../utils/helpers.js";

// Edit Profile Element
const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

// New Post Element
const newPostBtn = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

// New Post Form
const newPostForm = newPostModal.querySelector(".modal__form");
const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const cardImageInput = newPostModal.querySelector("#card-image-input");
const cardDescriptionInput = newPostModal.querySelector(
  "#caption-description-input"
);

// Name & About Element
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

// Avatar Form Element
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarSubmitBtn = avatarModal.querySelector("#avatarSubmitBtn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarImg = document.getElementById("avatar");

// Delete Form Element
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteBtn = deleteModal.querySelector("#delete-btn");
const deleteCancelBtn = deleteModal.querySelector("#cancel-btn");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

// Card Preview Element
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

let selectedCard;
let selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "65069f40-5147-4d93-825a-0d2331637ee5",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    avatarImg.src = userData.avatar;
  })
  .catch(console.error);

const plus = document.getElementById("plus-icon");
plus.src = plusIcon;

const penIcon = document.getElementById("pencil-icon");
penIcon.src = pencilIcon;

const img = document.getElementById("logo");
img.src = logo;

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function handleLike(evt, id) {
  const likeButton = evt.currentTarget;
  const isLiked = likeButton.classList.contains("card__like-button_active");
  api
    .changeLikeStatus(id, isLiked)
    .then((res) => {
      likeButton.classList.toggle("card__like-button_active");
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeButtonEl = cardElement.querySelector(".card__like-button");
  cardLikeButtonEl.addEventListener("click", (evt) =>
    handleLike(evt, data._id)
  );

  if(data.isLiked) {
    cardLikeButtonEl.classList.add("card__like-button_active");
  }

  const cardDeleteButtonEl = cardElement.querySelector(".card__delete-button");
  cardDeleteButtonEl.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewModalCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function modalOverlayClose(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function handleEscapeClose(evt) {
  if (evt.key === "Escape" || evt.key === "Esc") {
    const activeModal = document.querySelector(".modal_is-opened");
    if (activeModal) {
      closeModal(activeModal);
    }
  }
}

function openModal(modal) {
  console.log("Open Modal");
  modal.classList.add("modal_is-opened");
  modal.addEventListener("mousedown", modalOverlayClose);
  document.addEventListener("keydown", handleEscapeClose);
}

function closeModal(modal) {
  console.log("Close Modal");
  modal.classList.remove("modal_is-opened");
  modal.removeEventListener("mousedown", modalOverlayClose);
  document.addEventListener("keydown", handleEscapeClose);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButttonText(submitBtn, true);
  const name = cardDescriptionInput.value;
  const link = cardImageInput.value;
  api
    .addCard({ name, link })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      closeModal(newPostModal);
      newPostForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButttonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const deleteBtn = evt.submitter;
  deleteBtn.textContent = "Deleting..."
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      deleteBtn.textContent = "Delete"
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseButton.addEventListener("click", function () {
  closeModal(previewModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButttonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButttonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButttonText(submitBtn, true);
  api
    .editAvaterInfo(avatarInput.value)
    .then((data) => {
      const avatarImage = document.getElementById("avatar");
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButttonText(submitBtn, false);
    });
}

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

deleteCancelBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

deleteModalCloseBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

newPostForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(settings);
