import './index.css';
import logo from '../images/Logo.svg';
// import avatar from '../images/avatar.jpg';
import pencilIcon from '../images/pencil.svg';
import plusIcon from '../images/plus.svg';


import { enableValidation, settings, resetValidation, disableButton } from "../scripts/validation.js";
import Api from '../utils/Api.js';

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "65069f40-5147-4d93-825a-0d2331637ee5",
    "Content-Type": "application/json"
  }
});


// destructure the second item in the callback of .then()
  api
    .getAppInfo()
    .then(([cards, userData]) => {
      cards.forEach((item) => {
        const cardElement = getCardElement(item);
        cardsList.append(cardElement);
      });

      // handle the user's information
      // - set the src of the avatar image
      // - set the textContent of both the text elements
      const profileName = document.getElementById("profile__name");
      const profileAbout = document.getElementById("profile__description");
      const avatarImg = document.getElementById("avatar");

      profileName.textContent = userData.name;
      profileAbout.textContent = userData.about;
      avatarImg.src = userData.avatar;
    })
    .catch(console.error);

const plus = document.getElementById("plus-icon");
plus.src = plusIcon;

const penIcon = document.getElementById("pencil-icon");
penIcon.src = pencilIcon;

// const bioPic = document.getElementById("avatar");
// bioPic.src = avatar;

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

// Edit Profile Element
const editProfileBtn = document.querySelector('.profile__edit-button');
const editProfileModal = document.querySelector('#edit-profile-modal');
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const editProfileCloseBtn = editProfileModal.querySelector('.modal__close-btn');
const editProfileForm = editProfileModal.querySelector('.modal__form');
const editProfileNameInput = editProfileModal.querySelector('#profile-name-input');
const editProfileDescriptionInput = editProfileModal.querySelector('#profile-description-input');

// New Post Element
const newPostBtn = document.querySelector('.profile__add-button');
const newPostModal = document.querySelector('#new-post-modal');
const newPostCloseBtn = newPostModal.querySelector('.modal__close-btn');

// New Post Form
const newPostForm = newPostModal.querySelector('.modal__form');
const cardSubmitBtn = newPostModal.querySelector('.modal__submit-btn');
const cardImageInput = newPostModal.querySelector('#card-image-input');
const cardDescriptionInput = newPostModal.querySelector('#caption-description-input');

// Name & About Element
const profileNameEl = document.querySelector('.profile__name');
const profileDescriptionEl = document.querySelector('.profile__description');

// Avatar Form Element
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarSubmitBtn = avatarModal.querySelector("#avatarSubmitBtn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Delete Form Element
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

// Card Preview Element
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

let selectedCard;
let selectedCardId;

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeButtonEl = cardElement.querySelector(".card__like-button");
  cardLikeButtonEl.addEventListener("click", () => {
    cardLikeButtonEl.classList.toggle("card__like-button_active");
  });


  const cardDeleteButtonEl = cardElement.querySelector(".card__delete-button");
  cardDeleteButtonEl.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
    cardElement.remove();
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
    const activeModal = document.querySelector('.modal_is-opened');
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

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      // Remove card from the Dom
      // Close the modal
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, [editProfileNameInput, editProfileDescriptionInput], settings);
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
  api.editUserInfo({ name: editProfileNameInput.value, about: editProfileDescriptionInput.value })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error);
};

editProfileForm.addEventListener('submit', handleEditProfileSubmit);

// Finish avatar submission handler
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  console.log(avatarInput.value);
  api.editAvaterInfo(avatarInput.value)
    .then((data) => {
      const avatarImage = document.getElementById("avatar");
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
      // make this function work
      // set the src of the avatar image
    })
    .catch(console.error);
}

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

avatarForm.addEventListener('submit', handleAvatarSubmit);

deleteForm.addEventListener('submit', handleDeleteSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: cardDescriptionInput.value,
    link: cardImageInput.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(newPostModal);
  newPostForm.reset();
  disableButton(cardSubmitBtn, settings);
};

newPostForm.addEventListener('submit', handleAddCardSubmit);




enableValidation(settings);