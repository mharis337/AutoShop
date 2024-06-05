document.addEventListener("DOMContentLoaded", function () {
  // Green Dot on Time Card
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = new Date().getDay();
  const todayId = days[today];
  const todayElement = document.getElementById(todayId);
  if (todayElement) {
    const dotSpan = document.createElement("span");
    dotSpan.classList.add("current-day-dot");
    const timeElement = todayElement.querySelector(".time");
    todayElement.insertBefore(dotSpan, timeElement);
  }

  // Appointment Booking
  let selectedServiceType = "";

  // Get services from URL
  const urlParams = new URLSearchParams(window.location.search);
  const service = urlParams.get("service");
  if (service) {
    const buttons = document.querySelectorAll(".service-btn, .dropdown-service");
    buttons.forEach((button) => {
      if (button.getAttribute("data-value") === service) {
        button.classList.add("active");
        selectedServiceType = service;
        if (button.tagName.toLowerCase() === "a") {
          const dropdownButton = document.querySelector(".dropdown-toggle");
          dropdownButton.innerHTML = `${service} <span class="caret"></span>`;
        }
      }
    });
  }

  // Toggle Service button
  document.querySelectorAll(".service-btn").forEach((button) => {
    button.addEventListener("click", function () {
      document.querySelectorAll(".service-btn").forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      selectedServiceType = this.getAttribute("data-value");
    });
  });

  // Handle dropdown service item clicks
  document.querySelectorAll(".dropdown-service").forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelectorAll(".service-btn").forEach((btn) => btn.classList.remove("active"));
      selectedServiceType = this.getAttribute("data-value");
    });
  });

  // Handle form submission
  const appointmentForm = document.getElementById("appointmentForm");
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("email").value;
      const specialist = document.getElementById("specialist").value;
      const preferredDate = document.getElementById("preferredDate").value;
      const preferredTime = document.getElementById("preferredTime").value;

      if (!selectedServiceType) {
        alert("Please select a service type.");
        return;
      }

      const params = new URLSearchParams({
        name: fullName,
        email: email,
        service: selectedServiceType,
        specialist: specialist,
        date: preferredDate,
        time: preferredTime,
      });
      window.location.href = "confirmation.html?" + params.toString();
    });
  }

  // Confirmation Page
  const confirmationElement = document.getElementById("confirmationMessage");
  if (confirmationElement) {
    const formData = Object.fromEntries(urlParams.entries());
    const confirmationMessage = `
      Thank you ${formData.name}! <br>
      Your appointment for ${formData.service} has been booked for ${formData.date} at ${formData.time}.<br>
      An email confirmation has been sent to ${formData.email}.
    `;
    confirmationElement.innerHTML = confirmationMessage;
  }

  // Redirect to appointment page with selected service
  document.querySelectorAll(".book-service").forEach((button) => {
    button.addEventListener("click", function () {
      const service = this.getAttribute("data-service");
      window.location.href = `appointments.html?service=${service}`;
    });
  });

  // Redirect to appointment page with selected specialist
  document.querySelectorAll(".book-specialist-btn button").forEach((button) => {
    button.addEventListener("click", function () {
      const specialistId = this.getAttribute("data-specialist-id");
      window.location.href = `appointments.html?specialist=${specialistId}`;
    });
  });

  // Preselect specialist in dropdown
  const specialistId = urlParams.get("specialist");
  if (specialistId) {
    const specialistDropdown = document.getElementById("specialist");
    if (specialistDropdown) {
      specialistDropdown.value = specialistId;
    }
  }
});
