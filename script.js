// app.js

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, set, get, update, remove, push } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Import jsPDF
const { jsPDF } = window.jspdf;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7m26-S8weeb0aSC_DwtFd_w5ONXIX70c",
  authDomain: "nzbdc-8c044.firebaseapp.com",
  projectId: "nzbdc-8c044",
  storageBucket: "nzbdc-8c044.appspot.com",
  messagingSenderId: "856989031416",
  appId: "1:856989031416:web:abf277e22c13cf07fb540d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

// Global Variables
let editDonorId = null;
let currentPage = 1;
let searchCurrentPage = 1;
let approvedCurrentPage = 1;
const itemsPerPage = 10;
const approvedItemsPerPage = 10;
let currentUserRole = null;
let currentUserInfo = null;
let searchResultsData = [];
const adminEmail = "mdraduanislamriyaz@gmail.com";

// DOM Elements
const loginPage = document.getElementById("loginPage");
const loginForm = document.getElementById("loginForm");
const registerPage = document.getElementById("registerPage");
const registerForm = document.getElementById("registerForm");
const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const passwordResetModal = document.getElementById("passwordResetModal");
const passwordResetForm = document.getElementById("passwordResetForm");
const homePage = document.getElementById("homePage");
const profilePage = document.getElementById("profilePage");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileMobile = document.getElementById("profileMobile");
const profileAccess = document.getElementById("profileAccess");
const profileBtn = document.getElementById("profileBtn");
const donorInfoBtn = document.getElementById("donorInfoBtn");
const viewDonorsBtn = document.getElementById("viewDonorsBtn");
const searchDonorBtn = document.getElementById("searchDonorBtn");
const donorBookingPage = document.getElementById("donorBookingPage");
const bookingForm = document.getElementById("bookingForm");
const donorBookingBtn = document.getElementById("donorBookingBtn");
const checkReminderPage = document.getElementById("checkReminderPage");
const reminderList = document.getElementById("reminderList");
const checkReminderBtn = document.getElementById("checkReminderBtn");
const viewUrgentRequestsPage = document.getElementById("viewUrgentRequestsPage");
const userUrgentRequestsList = document.getElementById("userUrgentRequestsList");
const viewUrgentRequestsBtn = document.getElementById("viewUrgentRequestsBtn");
const viewUrgentRepliesBtn = document.getElementById("viewUrgentRepliesBtn");
const donorInfoPage = document.getElementById("donorInfoPage");
const donorForm = document.getElementById("donorForm");
const donorListPage = document.getElementById("donorListPage");
const donorTableBody = document.getElementById("donorTableBody");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const currentPageLabel = document.getElementById("currentPage");
const searchDonorPage = document.getElementById("searchDonorPage");
const searchBtn = document.getElementById("searchBtn");
const searchName = document.getElementById("searchName");
const searchBloodGroup = document.getElementById("searchBloodGroup");
const searchResultsPage = document.getElementById("searchResultsPage");
const searchResultsBody = document.getElementById("searchResultsBody");
const searchPrevPageBtn = document.getElementById("searchPrevPageBtn");
const searchNextPageBtn = document.getElementById("searchNextPageBtn");
const searchCurrentPageLabel = document.getElementById("searchCurrentPage");
const aboutUsPage = document.getElementById("aboutUsPage");
const aboutUsBtn = document.getElementById("aboutUsBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminPanel = document.getElementById("adminPanel");
const logoutAdminBtn = document.getElementById("logoutAdminBtn");
const managePendingUsersBtn = document.getElementById("managePendingUsersBtn");
const manageApprovedUsersBtn = document.getElementById("manageApprovedUsersBtn");
const dashboardBtn = document.getElementById("dashboardBtn");
const donorDownloadBtn = document.getElementById("donorDownloadBtn");
const urgentRequestAdminBtn = document.getElementById("urgentRequestAdminBtn");
const reminderAdminBtn = document.getElementById("reminderAdminBtn");
const bookingRequestsPage = document.getElementById("bookingRequestsPage");
const bookingRequestsTableBody = document.getElementById("bookingRequestsTableBody");
const viewBookingRepliesBtn = document.getElementById("viewBookingRepliesBtn");
const pendingUsersPage = document.getElementById("pendingUsersPage");
const pendingUsersTableBody = document.getElementById("pendingUsersTableBody");
const approvedUsersPage = document.getElementById("approvedUsersPage");
const approvedUsersTableBody = document.getElementById("approvedUsersTableBody");
const approvedPrevPageBtn = document.getElementById("approvedPrevPageBtn");
const approvedNextPageBtn = document.getElementById("approvedNextPageBtn");
const approvedCurrentPageLabel = document.getElementById("approvedCurrentPage");
const dashboardPage = document.getElementById("dashboardPage");
const totalDonorsElem = document.getElementById("totalDonors");
const donationDueCountElem = document.getElementById("donationDueCount");
const totalUsersElem = document.getElementById("totalUsers");
const fullAccessCountElem = document.getElementById("fullAccessCount");
const userAccessCountElem = document.getElementById("userAccessCount");
const donorDownloadPage = document.getElementById("donorDownloadPage");
const downloadDonorBtn = document.getElementById("downloadDonorBtn");
const urgentRequestAdminPage = document.getElementById("urgentRequestAdminPage");
const urgentRequestForm = document.getElementById("urgentRequestForm");
const reminderAdminPage = document.getElementById("reminderAdminPage");
const sendReminderBtn = document.getElementById("sendReminderBtn");
const viewBookingRepliesPage = document.getElementById("viewBookingRepliesPage");
const bookingRepliesList = document.getElementById("bookingRepliesList");
const viewUrgentRepliesPage = document.getElementById("viewUrgentRepliesPage");
const urgentRepliesList = document.getElementById("urgentRepliesList");

// Navigation Function
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
  document.getElementById(pageId).style.display = 'block';
  history.pushState({ page: pageId }, null);
}

// Handle Browser Back Button
window.addEventListener('popstate', event => {
  const state = event.state || { page: 'loginPage' };
  document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
  document.getElementById(state.page).style.display = 'block';
});

// Initial Setup
history.replaceState({ page: 'loginPage' }, null);
loginPage.style.display = "block";

// Role-Based Feature Activation
function enableUserAccessFeatures() {
  currentUserRole = 'userAccess';
}

function enableFullAccessFeatures() {
  currentUserRole = 'fullAccess';
}

// Load User Profile Data
function loadUserProfile(userId) {
  get(ref(db, `approvedUsers/${userId}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        currentUserInfo = userData;
        profileName.textContent = `Name: ${userData.name}`;
        profileEmail.textContent = `Email: ${userData.email}`;
        profileMobile.textContent = `Mobile: ${userData.mobile}`;
        profileAccess.textContent = `Access: ${userData.role}`;
      }
    })
    .catch(error => console.error("Error loading profile: " + error.message));
}

// Registration Handler
registerForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("registerName").value;
  const mobile = document.getElementById("registerMobile").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      set(ref(db, `pendingUsers/${user.uid}`), { name, mobile, email })
        .then(() => {
          alert("Registration request sent! Waiting for admin approval.");
          signOut(auth);
          navigateTo('loginPage');
        });
    })
    .catch(error => alert("Error: " + error.message));
});

// Login Handler
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      if (email === adminEmail) {
        navigateTo('adminPanel');
      } else {
        checkUserRole(user.uid).then(role => {
          if (role === "fullAccess") {
            enableFullAccessFeatures();
          } else if (role === "userAccess") {
            enableUserAccessFeatures();
          } else {
            alert("Your account is not approved yet.");
            signOut(auth);
            return;
          }
          navigateTo('homePage');
          loadUserProfile(user.uid);
        })
        .catch(error => {
          alert("Error: " + error.message);
          signOut(auth);
        });
      }
    })
    .catch(error => alert("Error: " + error.message));
});

// Check User Role
function checkUserRole(userId) {
  return get(ref(db, `approvedUsers/${userId}`))
    .then(snapshot => {
      if (snapshot.exists()) return snapshot.val().role;
      else throw new Error("User role not found");
    });
}

// Logout Handlers
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => navigateTo('loginPage'));
});

logoutAdminBtn.addEventListener("click", () => {
  signOut(auth).then(() => navigateTo('loginPage'));
});

// Home Page Navigation
profileBtn.addEventListener("click", () => navigateTo('profilePage'));
donorInfoBtn.addEventListener("click", () => navigateTo('donorInfoPage'));
viewDonorsBtn.addEventListener("click", () => { navigateTo('donorListPage'); loadDonorList(); });
searchDonorBtn.addEventListener("click", () => navigateTo('searchDonorPage'));
aboutUsBtn.addEventListener("click", () => navigateTo('aboutUsPage'));

// Profile Options
donorBookingBtn.addEventListener("click", () => navigateTo('donorBookingPage'));
checkReminderBtn.addEventListener("click", () => { loadUserReminders(); navigateTo('checkReminderPage'); });
viewUrgentRequestsBtn.addEventListener("click", () => { loadUserUrgentRequests(); navigateTo('viewUrgentRequestsPage'); });
viewUrgentRepliesBtn.addEventListener("click", () => { loadUrgentReplies(); navigateTo('viewUrgentRepliesPage'); });

// Donor Booking Form Handler
bookingForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!auth.currentUser) {
    alert("Please log in to book a donation.");
    return;
  }
  const bookingData = {
    patientName: document.getElementById("patientName").value,
    patientProblem: document.getElementById("patientProblem").value,
    patientAge: document.getElementById("patientAge").value,
    bloodAmount: document.getElementById("bloodAmount").value,
    hemoglobin: document.getElementById("hemoglobin").value,
    patientMobile: document.getElementById("patientMobile").value,
    donorMobile: document.getElementById("donorMobile").value,
    hospitalName: document.getElementById("hospitalName").value,
    bookingDate: document.getElementById("bookingDate").value,
    bookingTime: document.getElementById("bookingTime").value,
    referenceInfo: document.getElementById("referenceInfo").value,
    userId: auth.currentUser.uid,
    timestamp: Date.now()
  };
  const newBookingRef = push(ref(db, "bookings"));
  set(newBookingRef, bookingData)
    .then(() => {
      alert("Donation booking successful!");
      bookingForm.reset();
      navigateTo('profilePage');
    })
    .catch(error => alert("Error: " + error.message));
});

// Donor Info Form Handler
donorForm.addEventListener("submit", e => {
  e.preventDefault();
  e.stopPropagation();

  if (!auth.currentUser) {
    alert("Please log in to add donor information.");
    return;
  }

  const donorMobileInput = document.querySelector("#donorForm #donorMobile");
  if (!donorMobileInput) {
    console.error("donorMobile input not found in DOM");
    alert("Error: Mobile input field not found!");
    return;
  }

  const mobileValue = donorMobileInput.value.trim();
  console.log("Raw Mobile Input Value:", donorMobileInput.value);
  console.log("Trimmed Mobile Value:", mobileValue);

  const mobileRegex = /^\d{10,13}$/;
  if (!mobileRegex.test(mobileValue)) {
    alert("Please enter a valid mobile number (10-13 digits).");
    return;
  }

  const donorData = {
    name: document.getElementById("donorName").value.trim(),
    age: document.getElementById("donorAge").value,
    gender: document.getElementById("donorGender").value,
    location: document.getElementById("donorLocation").value.trim(),
    mobile: mobileValue,
    bloodGroup: document.getElementById("donorBloodGroup").value,
    lastDonationDate: document.getElementById("donorLastDonationDate").value,
    nextDonationDate: calculateNextDonationDate(document.getElementById("donorLastDonationDate").value),
    userId: auth.currentUser.uid
  };
  console.log("Donor Data before saving:", donorData);

  if (editDonorId) {
    update(ref(db, `donors/${editDonorId}`), donorData)
      .then(() => {
        console.log("Updated Donor Data:", donorData);
        alert("Donor information updated successfully!");
        editDonorId = null;
        donorForm.reset();
        navigateTo('donorListPage');
        loadDonorList();
      })
      .catch(error => {
        console.error("Error updating donor:", error);
        alert("Error updating donor: " + error.message);
      });
  } else {
    const newDonorRef = push(ref(db, "donors"));
    set(newDonorRef, donorData)
      .then(() => {
        console.log("Saved Donor Data:", donorData);
        alert("Donor information saved successfully!");
        donorForm.reset();
        navigateTo('homePage');
      })
      .catch(error => {
        console.error("Error saving donor:", error);
        alert("Error saving donor: " + error.message);
      });
  }
});

// Load User Donation Reminders
function loadUserReminders() {
  get(ref(db, "reminders"))
    .then(snapshot => {
      reminderList.innerHTML = "";
      if (snapshot.exists()) {
        const reminders = snapshot.val();
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        Object.entries(reminders).forEach(([key, reminder]) => {
          if (Date.now() - reminder.timestamp > threeDaysMs) {
            remove(ref(db, `reminders/${key}`));
          } else {
            reminderList.innerHTML += `<p>${reminder.message} (Sent on: ${new Date(reminder.timestamp).toLocaleString()})</p>`;
          }
        });
      } else {
        reminderList.innerHTML = "<p>No reminders found.</p>";
      }
    })
    .catch(error => console.error("Error: " + error.message));
}

// Load User Urgent Requests with Reply Option
function loadUserUrgentRequests() {
  get(ref(db, "urgentRequests"))
    .then(snapshot => {
      userUrgentRequestsList.innerHTML = "";
      if (snapshot.exists()) {
        const requests = snapshot.val();
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        let patientNumber = 1;
        let content = "";
        Object.entries(requests).forEach(([key, req]) => {
          if (Date.now() - req.timestamp > threeDaysMs) {
            remove(ref(db, `urgentRequests/${key}`));
          } else {
            content += `
              <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
                <h3>Patient ${patientNumber}</h3>
                <p><strong>Patient Name:</strong> ${req.patientName}</p>
                <p><strong>Patient Problem:</strong> ${req.patientProblem}</p>
                <p><strong>Patient Age:</strong> ${req.patientAge}</p>
                <p><strong>Blood Amount:</strong> ${req.bloodAmount}</p>
                <p><strong>Hemoglobin:</strong> ${req.hemoglobin}</p>
                <p><strong>Patient Mobile:</strong> ${req.patientMobile}</p>
                <p><strong>Donor Mobile:</strong> ${req.donorMobile}</p>
                <p><strong>Hospital Name:</strong> ${req.hospitalName}</p>
                <p><strong>Request Date:</strong> ${req.requestDate}</p>
                <p><strong>Request Time:</strong> ${req.requestTime}</p>
                <p><strong>Reference:</strong> ${req.referenceInfo}</p>
                <p><strong>Submitted On:</strong> ${new Date(req.timestamp).toLocaleString()}</p>
                <button onclick="showUrgentReplyForm('${key}', ${patientNumber})">Reply</button>
                <div id="urgentReplyForm-${key}" style="display:none; margin-top: 10px;">
                  <textarea id="urgentReplyText-${key}" rows="3" placeholder="Type your reply here"></textarea><br>
                  <button onclick="submitUrgentReply('${key}', ${patientNumber}, '${req.patientName}', '${req.hemoglobin}', '${req.patientMobile}')">Submit Reply</button>
                </div>
              </div>
            `;
            patientNumber++;
          }
        });
        userUrgentRequestsList.innerHTML = content || "<p>No urgent requests found.</p>";
      } else {
        userUrgentRequestsList.innerHTML = "<p>No urgent requests found.</p>";
      }
    })
    .catch(error => console.error("Error: " + error.message));
}

// Show Urgent Request Reply Form
window.showUrgentReplyForm = function(requestId, patientNumber) {
  const replyForm = document.getElementById(`urgentReplyForm-${requestId}`);
  replyForm.style.display = replyForm.style.display === "none" ? "block" : "none";
};

// Submit Urgent Request Reply (User to Admin)
window.submitUrgentReply = function(requestId, patientNumber, patientName, hemoglobin, patientMobile) {
  const replyText = document.getElementById(`urgentReplyText-${requestId}`).value.trim();
  if (!replyText) {
    alert("Please enter a reply.");
    return;
  }
  if (!auth.currentUser) {
    alert("Please log in to reply.");
    return;
  }

  const replyData = {
    requestId: requestId,
    userId: auth.currentUser.uid,
    patientSerial: patientNumber,
    patientName: patientName,
    hemoglobin: hemoglobin,
    patientMobile: patientMobile,
    reply: replyText,
    timestamp: Date.now()
  };
  const newReplyRef = push(ref(db, "urgentRequestReplies"));
  set(newReplyRef, replyData)
    .then(() => {
      alert("Reply submitted successfully to Admin!");
      document.getElementById(`urgentReplyText-${requestId}`).value = "";
      document.getElementById(`urgentReplyForm-${requestId}`).style.display = "none";
    })
    .catch(error => alert("Error: " + error.message));
};

// Load Donor List with Pagination
function loadDonorList(page = 1) {
  get(ref(db, "donors/"))
    .then(snapshot => {
      donorTableBody.innerHTML = "";
      if (snapshot.exists()) {
        const donors = Object.entries(snapshot.val());
        const totalPages = Math.ceil(donors.length / itemsPerPage);
        currentPage = page;
        currentPageLabel.textContent = `Page: ${currentPage}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const donorsToShow = donors.slice(startIndex, startIndex + itemsPerPage);
        let donorNumber = startIndex + 1;
        let content = "";
        donorsToShow.forEach(([donorId, donor]) => {
          const deleteButton = currentUserRole === 'fullAccess' ? `<button onclick="deleteDonor('${donorId}')">Delete</button>` : '';
          content += `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
              <h3>Donor ${donorNumber}</h3>
              <p><strong>Name:</strong> ${donor.name}</p>
              <p><strong>Age:</strong> ${donor.age}</p>
              <p><strong>Gender:</strong> ${donor.gender || '-'}</p>
              <p><strong>Location:</strong> ${donor.location || '-'}</p>
              <p><strong>Mobile:</strong> ${donor.mobile || '-'}</p>
              <p><strong>Blood Group:</strong> ${donor.bloodGroup}</p>
              <p><strong>Last Donation:</strong> ${donor.lastDonationDate}</p>
              <p><strong>Next Donation:</strong> ${donor.nextDonationDate}</p>
              <p>${deleteButton}</p>
            </div>
          `;
          donorNumber++;
        });
        donorTableBody.innerHTML = content || "<p>No donors found.</p>";
      } else {
        donorTableBody.innerHTML = "<p>No donors found.</p>";
      }
    })
    .catch(error => alert("Error: " + error.message));
}

// Donor List Pagination Buttons
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) loadDonorList(currentPage - 1);
});

nextPageBtn.addEventListener("click", () => {
  get(ref(db, "donors/"))
    .then(snapshot => {
      if (snapshot.exists()) {
        const donors = Object.entries(snapshot.val());
        const totalPages = Math.ceil(donors.length / itemsPerPage);
        if (currentPage < totalPages) loadDonorList(currentPage + 1);
      }
    });
});

// Search Functionality
searchBtn.addEventListener("click", () => {
  const bloodGroup = searchBloodGroup.value.trim();
  const donorName = searchName.value.trim().toLowerCase();
  const today = new Date();
  get(ref(db, "donors"))
    .then(snapshot => {
      searchResultsData = [];
      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          const donor = childSnapshot.val();
          const donorId = childSnapshot.key;
          const nextDonationDate = new Date(donor.nextDonationDate);
          if ((bloodGroup ? donor.bloodGroup === bloodGroup : true) &&
              (donorName ? donor.name.toLowerCase().includes(donorName) : true) &&
              nextDonationDate <= today) {
            searchResultsData.push({ donorId, ...donor });
          }
        });
      }
      searchCurrentPage = 1;
      displaySearchResults();
      navigateTo('searchResultsPage');
    })
    .catch(error => alert("Error: " + error.message));
});

// Display Search Results
function displaySearchResults() {
  const startIndex = (searchCurrentPage - 1) * itemsPerPage;
  const paginatedData = searchResultsData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(searchResultsData.length / itemsPerPage);
  searchCurrentPageLabel.textContent = `${searchCurrentPage} of ${totalPages}`;
  searchPrevPageBtn.disabled = searchCurrentPage === 1;
  searchNextPageBtn.disabled = searchCurrentPage === totalPages;
  let donorNumber = startIndex + 1;
  let content = "";
  paginatedData.forEach(donor => {
    const actions = currentUserRole === 'fullAccess' ? `
      <button onclick="editDonor('${donor.donorId}')">Edit</button>
      <button onclick="deleteDonor('${donor.donorId}')">Delete</button>
    ` : '';
    content += `
      <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
        <h3>Donor ${donorNumber}</h3>
        <p><strong>Name:</strong> ${donor.name}</p>
        <p><strong>Age:</strong> ${donor.age}</p>
        <p><strong>Location:</strong> ${donor.location || '-'}</p>
        <p><strong>Mobile:</strong> ${donor.mobile || '-'}</p>
        <p><strong>Blood Group:</strong> ${donor.bloodGroup}</p>
        <p><strong>Last Donation:</strong> ${donor.lastDonationDate}</p>
        <p><strong>Next Donation:</strong> ${donor.nextDonationDate}</p>
        <p>${actions}</p>
      </div>
    `;
    donorNumber++;
  });
  searchResultsBody.innerHTML = content || "<p>No donors found.</p>";
}

searchPrevPageBtn.addEventListener("click", () => {
  if (searchCurrentPage > 1) {
    searchCurrentPage--;
    displaySearchResults();
  }
});

searchNextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(searchResultsData.length / itemsPerPage);
  if (searchCurrentPage < totalPages) {
    searchCurrentPage++;
    displaySearchResults();
  }
});

// Admin Functions
function loadPendingUsers() {
  get(ref(db, "pendingUsers"))
    .then(snapshot => {
      pendingUsersTableBody.innerHTML = "";
      if (snapshot.exists()) {
        const pendingUsers = snapshot.val();
        let userNumber = 1;
        let content = "";
        Object.entries(pendingUsers).forEach(([userId, user]) => {
          content += `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
              <h3>User ${userNumber}</h3>
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Mobile:</strong> ${user.mobile}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Actions:</strong>
                <button onclick="approveUser('${userId}', 'userAccess')">User Access</button>
                <button onclick="approveUser('${userId}', 'fullAccess')">Full Access</button>
                <button onclick="denyUser('${userId}')">Delete</button>
              </p>
            </div>
          `;
          userNumber++;
        });
        pendingUsersTableBody.innerHTML = content;
      } else {
        pendingUsersTableBody.innerHTML = "<p>No pending users.</p>";
      }
    })
    .catch(error => alert("Error: " + error.message));
}

window.approveUser = function(userId, role) {
  get(ref(db, `pendingUsers/${userId}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const user = snapshot.val();
        set(ref(db, `approvedUsers/${userId}`), { name: user.name, mobile: user.mobile, email: user.email, role })
          .then(() => remove(ref(db, `pendingUsers/${userId}`)))
          .then(() => {
            alert("User approved successfully with " + role + " access.");
            loadPendingUsers();
          })
          .catch(error => alert("Error: " + error.message));
      }
    })
    .catch(error => alert("Error: " + error.message));
};

window.denyUser = function(userId) {
  remove(ref(db, `pendingUsers/${userId}`))
    .then(() => {
      alert("Pending user deleted successfully.");
      loadPendingUsers();
    })
    .catch(error => alert("Error: " + error.message));
};

function loadApprovedUsers(page = 1) {
  get(ref(db, 'approvedUsers'))
    .then(snapshot => {
      approvedUsersTableBody.innerHTML = "";
      if (snapshot.exists()) {
        const users = Object.entries(snapshot.val());
        const totalPages = Math.ceil(users.length / approvedItemsPerPage);
        approvedCurrentPage = page;
        approvedCurrentPageLabel.textContent = `Page: ${approvedCurrentPage}`;
        approvedPrevPageBtn.disabled = approvedCurrentPage === 1;
        approvedNextPageBtn.disabled = approvedCurrentPage === totalPages;
        const startIndex = (approvedCurrentPage - 1) * approvedItemsPerPage;
        const usersToShow = users.slice(startIndex, startIndex + approvedItemsPerPage);
        let userNumber = startIndex + 1;
        let content = "";
        usersToShow.forEach(([userId, user]) => {
          content += `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
              <h3>User ${userNumber}</h3>
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Mobile:</strong> ${user.mobile}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Current Access:</strong> ${user.role}</p>
              <p><strong>Change Access:</strong>
                <select class="accessSelect" data-userid="${userId}">
                  <option value="userAccess" ${user.role === 'userAccess' ? 'selected' : ''}>User Access</option>
                  <option value="fullAccess" ${user.role === 'fullAccess' ? 'selected' : ''}>Full Access</option>
                </select>
              </p>
              <p><strong>Actions:</strong>
                <button onclick="removeUserAccess('${userId}')">Remove</button>
              </p>
            </div>
          `;
          userNumber++;
        });
        approvedUsersTableBody.innerHTML = content;
        document.querySelectorAll('.accessSelect').forEach(select => {
          select.addEventListener('change', e => {
            const userId = e.target.dataset.userid;
            const newRole = e.target.value;
            updateUserAccess(userId, newRole);
          });
        });
      } else {
        approvedUsersTableBody.innerHTML = "<p>No approved users.</p>";
      }
    })
    .catch(error => alert("Error: " + error.message));
}

approvedPrevPageBtn.addEventListener("click", () => {
  if (approvedCurrentPage > 1) loadApprovedUsers(approvedCurrentPage - 1);
});

approvedNextPageBtn.addEventListener("click", () => {
  get(ref(db, 'approvedUsers'))
    .then(snapshot => {
      if (snapshot.exists()) {
        const users = Object.entries(snapshot.val());
        const totalPages = Math.ceil(users.length / approvedItemsPerPage);
        if (approvedCurrentPage < totalPages) loadApprovedUsers(approvedCurrentPage + 1);
      }
    });
});

window.removeUserAccess = function(userId) {
  if (confirm("Are you sure you want to remove this user's access?")) {
    remove(ref(db, `approvedUsers/${userId}`))
      .then(() => {
        alert("User access removed successfully!");
        loadApprovedUsers();
      })
      .catch(error => alert("Error: " + error.message));
  }
};

function updateUserAccess(userId, newRole) {
  update(ref(db, `approvedUsers/${userId}`), { role: newRole })
    .then(() => {
      alert("Access updated successfully!");
      loadApprovedUsers(approvedCurrentPage);
    })
    .catch(error => alert("Error: " + error.message));
};

// Admin Panel Navigation
managePendingUsersBtn.addEventListener("click", () => { navigateTo('pendingUsersPage'); loadPendingUsers(); });
manageApprovedUsersBtn.addEventListener("click", () => { navigateTo('approvedUsersPage'); loadApprovedUsers(); });
dashboardBtn.addEventListener("click", () => { navigateTo('dashboardPage'); loadDashboardStats(); });
donorDownloadBtn.addEventListener("click", () => navigateTo('donorDownloadPage'));
urgentRequestAdminBtn.addEventListener("click", () => navigateTo('urgentRequestAdminPage'));
reminderAdminBtn.addEventListener("click", () => navigateTo('reminderAdminPage'));
bookingRequestsBtn.addEventListener("click", () => { navigateTo('bookingRequestsPage'); loadBookingRequests(); });
viewBookingRepliesBtn.addEventListener("click", () => { navigateTo('viewBookingRepliesPage'); loadBookingReplies(); });

// Dashboard Stats Function
function loadDashboardStats() {
  get(ref(db, "donors"))
    .then(snapshot => {
      let donorCount = 0, donationDue = 0;
      if (snapshot.exists()) {
        const donors = Object.values(snapshot.val());
        donorCount = donors.length;
        const today = new Date();
        donationDue = donors.filter(d => new Date(d.nextDonationDate) <= today).length;
      }
      totalDonorsElem.textContent = donorCount;
      donationDueCountElem.textContent = donationDue;
    })
    .catch(error => console.error("Error: " + error.message));
    
  get(ref(db, "approvedUsers"))
    .then(snapshot => {
      let total = 0, fullAccess = 0, userAccess = 0;
      if (snapshot.exists()) {
        const users = Object.values(snapshot.val());
        total = users.length;
        fullAccess = users.filter(u => u.role === "fullAccess").length;
        userAccess = users.filter(u => u.role === "userAccess").length;
      }
      totalUsersElem.textContent = total;
      fullAccessCountElem.textContent = fullAccess;
      userAccessCountElem.textContent = userAccess;
    })
    .catch(error => console.error("Error: " + error.message));
}

// Donor Info Download Function (PDF Format)
downloadDonorBtn.addEventListener("click", () => {
  get(ref(db, "donors"))
    .then(snapshot => {
      if (snapshot.exists()) {
        const donors = snapshot.val();
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("Donor Information", 14, 20);
        
        const headers = ["Name", "Age", "Gender", "Location", "Mobile", "Blood Group", "Last Donation", "Next Donation"];
        let y = 30;
        doc.setFontSize(12);
        headers.forEach((header, index) => {
          doc.text(header, 14 + index * 25, y);
        });

        y += 10;
        doc.setFontSize(10);
        Object.values(donors).forEach((donor, index) => {
          doc.text(donor.name || "-", 14, y);
          doc.text(donor.age || "-", 39, y);
          doc.text(donor.gender || "-", 64, y);
          doc.text(donor.location || "-", 89, y);
          doc.text(donor.mobile || "-", 114, y);
          doc.text(donor.bloodGroup || "-", 139, y);
          doc.text(donor.lastDonationDate || "-", 164, y);
          doc.text(donor.nextDonationDate || "-", 189, y);
          y += 10;

          if (y > 280) {
            doc.addPage();
            y = 20;
            doc.setFontSize(12);
            headers.forEach((header, idx) => {
              doc.text(header, 14 + idx * 25, y);
            });
            y += 10;
            doc.setFontSize(10);
          }
        });

        doc.save("donor_info.pdf");
      } else {
        alert("No donor data found.");
      }
    })
    .catch(error => alert("Error: " + error.message));
});

// Urgent Request (Admin) Handler
urgentRequestForm.addEventListener("submit", e => {
  e.preventDefault();
  const urgentData = {
    patientName: document.getElementById("patientNameUrgent").value,
    patientProblem: document.getElementById("patientProblemUrgent").value,
    patientAge: document.getElementById("patientAgeUrgent").value,
    bloodAmount: document.getElementById("bloodAmountUrgent").value,
    hemoglobin: document.getElementById("hemoglobinUrgent").value,
    patientMobile: document.getElementById("patientMobileUrgent").value,
    donorMobile: document.getElementById("donorMobileUrgent").value,
    hospitalName: document.getElementById("hospitalNameUrgent").value,
    requestDate: document.getElementById("requestDateUrgent").value,
    requestTime: document.getElementById("requestTimeUrgent").value,
    referenceInfo: document.getElementById("referenceInfoUrgent").value,
    timestamp: Date.now()
  };
  const newRequestRef = push(ref(db, "urgentRequests"));
  set(newRequestRef, urgentData)
    .then(() => {
      alert("Urgent request sent successfully!");
      urgentRequestForm.reset();
    })
    .catch(error => alert("Error: " + error.message));
});

// Send Reminder (Admin) Handler
sendReminderBtn.addEventListener("click", () => {
  const reminderData = {
    message: document.getElementById("reminderMessage").value,
    timestamp: Date.now()
  };
  const newReminderRef = push(ref(db, "reminders"));
  set(newReminderRef, reminderData)
    .then(() => alert("Reminder sent successfully!"))
    .catch(error => alert("Error: " + error.message));
});

// Load Booking Requests with Reply Option (Admin to User)
function loadBookingRequests() {
  get(ref(db, "bookings"))
    .then(snapshot => {
      bookingRequestsTableBody.innerHTML = "";
      if (snapshot.exists()) {
        const bookings = snapshot.val();
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        let patientNumber = 1;
        let content = "";
        Object.entries(bookings).forEach(([key, booking]) => {
          if (Date.now() - booking.timestamp > threeDaysMs) {
            remove(ref(db, `bookings/${key}`));
          } else {
            content += `
              <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
                <h3>Patient ${patientNumber}</h3>
                <p><strong>Patient Name:</strong> ${booking.patientName}</p>
                <p><strong>Patient Problem:</strong> ${booking.patientProblem}</p>
                <p><strong>Patient Age:</strong> ${booking.patientAge}</p>
                <p><strong>Blood Amount:</strong> ${booking.bloodAmount}</p>
                <p><strong>Hemoglobin:</strong> ${booking.hemoglobin}</p>
                <p><strong>Patient Mobile:</strong> ${booking.patientMobile}</p>
                <p><strong>Donor Mobile:</strong> ${booking.donorMobile}</p>
                <p><strong>Hospital Name:</strong> ${booking.hospitalName}</p>
                <p><strong>Booking Date:</strong> ${booking.bookingDate}</p>
                <p><strong>Booking Time:</strong> ${booking.bookingTime}</p>
                <p><strong>Reference:</strong> ${booking.referenceInfo}</p>
                <p><strong>Submitted On:</strong> ${new Date(booking.timestamp).toLocaleString()}</p>
                <button onclick="showBookingReplyForm('${key}', ${patientNumber})">Reply</button>
                <div id="bookingReplyForm-${key}" style="display:none; margin-top: 10px;">
                  <textarea id="bookingReplyText-${key}" rows="3" placeholder="Type your reply here"></textarea><br>
                  <button onclick="submitBookingReply('${key}', '${booking.userId}', ${patientNumber}, '${booking.patientName}', '${booking.hemoglobin}', '${booking.patientMobile}')">Submit Reply</button>
                </div>
              </div>
            `;
            patientNumber++;
          }
        });
        bookingRequestsTableBody.innerHTML = content || "<p>No booking requests found.</p>";
      } else {
        bookingRequestsTableBody.innerHTML = "<p>No booking requests found.</p>";
      }
    })
    .catch(error => alert("Error: " + error.message));
}

// Show Booking Reply Form
window.showBookingReplyForm = function(bookingId, patientNumber) {
  const replyForm = document.getElementById(`bookingReplyForm-${bookingId}`);
  replyForm.style.display = replyForm.style.display === "none" ? "block" : "none";
};

// Submit Booking Reply (Admin to User)
window.submitBookingReply = function(bookingId, userId, patientNumber, patientName, hemoglobin, patientMobile) {
  const replyText = document.getElementById(`bookingReplyText-${bookingId}`).value.trim();
  if (!replyText) {
    alert("Please enter a reply.");
    return;
  }

  const replyData = {
    bookingId: bookingId,
    adminId: "admin",
    userId: userId,
    patientSerial: patientNumber,
    patientName: patientName,
    hemoglobin: hemoglobin,
    patientMobile: patientMobile,
    reply: replyText,
    timestamp: Date.now()
  };
  const newReplyRef = push(ref(db, "bookingReplies"));
  set(newReplyRef, replyData)
    .then(() => {
      alert("Reply submitted successfully to User!");
      document.getElementById(`bookingReplyText-${bookingId}`).value = "";
      document.getElementById(`bookingReplyForm-${bookingId}`).style.display = "none";
    })
    .catch(error => alert("Error: " + error.message));
};

// Load Booking Replies (User Replies to Admin)
function loadBookingReplies() {
  get(ref(db, "urgentRequestReplies"))
    .then(snapshot => {
      bookingRepliesList.innerHTML = "";
      if (snapshot.exists()) {
        const replies = snapshot.val();
        let content = "";
        Object.entries(replies).forEach(([key, reply]) => {
          get(ref(db, `urgentRequests/${reply.requestId}`))
            .then(requestSnapshot => {
              const request = requestSnapshot.val();
              get(ref(db, `approvedUsers/${reply.userId}`))
                .then(userSnapshot => {
                  const user = userSnapshot.val();
                  content += `
                    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
                      <p><strong>Urgent Request:</strong> ${request.patientName} - ${request.hospitalName}</p>
                      <p><strong>Patient Serial:</strong> ${reply.patientSerial}</p>
                      <p><strong>Patient Name:</strong> ${reply.patientName}</p>
                      <p><strong>Hemoglobin:</strong> ${reply.hemoglobin}</p>
                      <p><strong>Patient Mobile:</strong> ${reply.patientMobile}</p>
                      <p><strong>User:</strong> ${user.name} (${user.email})</p>
                      <p><strong>Reply:</strong> ${reply.reply}</p>
                      <p><strong>Replied On:</strong> ${new Date(reply.timestamp).toLocaleString()}</p>
                    </div>
                  `;
                  bookingRepliesList.innerHTML = content || "<p>No replies found.</p>";
                });
            });
        });
      } else {
        bookingRepliesList.innerHTML = "<p>No replies found.</p>";
      }
    })
    .catch(error => alert("Error: " + error.message));
}

// Load Urgent Request Replies (Admin Replies to User)
function loadUrgentReplies() {
  get(ref(db, "bookingReplies"))
    .then(snapshot => {
      urgentRepliesList.innerHTML = "";
      if (snapshot.exists()) {
        const replies = snapshot.val();
        let content = "";
        Object.entries(replies).forEach(([key, reply]) => {
          if (reply.userId === auth.currentUser.uid) { // Filter replies for the current user
            get(ref(db, `bookings/${reply.bookingId}`))
              .then(bookingSnapshot => {
                const booking = bookingSnapshot.val();
                content += `
                  <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;">
                    <p><strong>Booking:</strong> ${booking.patientName} - ${booking.hospitalName}</p>
                    <p><strong>Patient Serial:</strong> ${reply.patientSerial}</p>
                    <p><strong>Patient Name:</strong> ${reply.patientName}</p>
                    <p><strong>Hemoglobin:</strong> ${reply.hemoglobin}</p>
                    <p><strong>Patient Mobile:</strong> ${reply.patientMobile}</p>
                    <p><strong>Admin Reply:</strong> ${reply.reply}</p>
                    <p><strong>Replied On:</strong> ${new Date(reply.timestamp).toLocaleString()}</p>
                  </div>
                `;
                urgentRepliesList.innerHTML = content || "<p>No replies found.</p>";
              });
          }
        });
      } else {
        urgentRepliesList.innerHTML = "<p>No replies found.</p>";
      }
    })
    .catch(error => alert("Error: " + error.message));
}

// Utility Function to calculate next donation date
function calculateNextDonationDate(lastDate) {
  const date = new Date(lastDate);
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().split('T')[0];
}

// Edit Donor Function
window.editDonor = function(donorId) {
  get(ref(db, `donors/${donorId}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const donor = snapshot.val();
        document.getElementById("donorName").value = donor.name;
        document.getElementById("donorAge").value = donor.age;
        document.getElementById("donorGender").value = donor.gender || "";
        document.getElementById("donorLocation").value = donor.location || "";
        document.getElementById("donorMobile").value = donor.mobile || "";
        document.getElementById("donorBloodGroup").value = donor.bloodGroup;
        document.getElementById("donorLastDonationDate").value = donor.lastDonationDate;
        editDonorId = donorId;
        navigateTo('donorInfoPage');
      }
    })
    .catch(error => console.error("Error: " + error.message));
};

// Delete Donor Function
window.deleteDonor = function(donorId) {
  if (confirm("Are you sure you want to delete this donor?")) {
    remove(ref(db, `donors/${donorId}`))
      .then(() => {
        alert("Donor deleted successfully!");
        loadDonorList(currentPage);
      })
      .catch(error => alert("Error: " + error.message));
  }
};

// Password Reset Functionality
forgotPasswordLink.addEventListener("click", e => {
  e.preventDefault();
  passwordResetModal.style.display = "block";
});

passwordResetForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset link sent. Please check your email.");
      passwordResetModal.style.display = "none";
    })
    .catch(error => alert("Error: " + error.message));
});

// Register Link Handler
registerLink.addEventListener("click", e => {
  e.preventDefault();
  navigateTo('registerPage');
});

// Login Link Handler
loginLink.addEventListener("click", e => {
  e.preventDefault();
  navigateTo('loginPage');
});

// Initial Setup: Hide all pages except login
document.querySelectorAll(".page").forEach(page => page.style.display = "none");
loginPage.style.display = "block";