# Calvin Ratings
## Software Requirements Specification (SRS)

**Team C**  
**Platform:** React Native / Expo Mobile App

---

# 1. Introduction

## 1.1 Purpose

The purpose of Calvin Ratings is to give Calvin University students an easy way to learn more about places around campus. Students will be able to look at ratings from other students to help decide where they want to study, socialize, or spend time.

The app will focus on information that may not be easy to find on the normal Calvin website. This includes things like how busy a location currently is, what a location is used for, and what other students think about it.

For example, a student who wants to study at the library could check the app before walking there. Recent student ratings could show whether the library is currently busy or whether it would be a good place to study.

## 1.2 Intended Audience

The main users of Calvin Ratings are Calvin University students.

This SRS is also meant for the members of Team C who are designing, developing, and testing the application. It gives the team a shared idea of what the application should eventually be able to do.

## 1.3 Intended Use

Students will use Calvin Ratings to:

- Find places around Calvin's campus.
- Learn what different campus locations are used for.
- See ratings submitted by other Calvin students.
- Check how busy certain locations are.
- Submit their own ratings.
- Find highly rated places around campus.

The app could be especially helpful for new students who may not already know what different buildings, rooms, and locations around campus are used for.

## 1.4 Product Scope

Calvin Ratings will be a mobile application built using React Native and Expo.

The main goal is to create a rating system specifically for the Calvin University community. Ratings will include both number-based ratings and categories depending on the type of location.

For example, a study location may have a rating for how busy it currently is, while another type of campus location may use a different rating that makes more sense for that place.

Only Calvin-related users should be able to use the main features of the application. Calvin membership will be checked using a Calvin email address.

Students will also be able to use ratings to find some of the highest-rated places on campus.

The first version of the project will be a working prototype with the basic screens and features needed to demonstrate the idea. Not every planned feature needs to be completely implemented in the first prototype.

## 1.5 Definitions and Acronyms

- **SRS:** Software Requirements Specification.
- **User:** A person using the application **without** a verified Calvin account.
- **Calvin Student:** A Calvin student using the application **with** a verified Calvin account.
- **Rating:** Information submitted by a user about a campus place.
- **Live Rating:** A recent rating meant to show the current state of a place, such as how busy it is.
- **Place:** A location on or around Calvin University's campus that is listed in the application.
- **Expo:** The development platform being used with React Native to build and test the mobile application.

---

# 2. Overall Description

## 2.1 User Needs

Calvin students need a quick way to find useful information about campus locations without having to visit the location first.

Students should be able to browse campus places and see basic information about them. This is especially useful for students who are unfamiliar with campus.

Students also need a way to see recent opinions and information from other students. For example, someone looking for a study location may want to know whether that location is currently crowded.

Users should be able to contribute information by submitting their own ratings. These ratings should help keep the information in the app useful and up to date.

Students should also be able to use ratings to find places that are highly rated by other Calvin students.

The application should be simple enough that students can quickly check a location or rating without needing to go through many screens.

## 2.2 Assumptions and Dependencies

- Users will have access to a mobile device and an internet connection.
- The application will be developed using React Native and Expo.
- The app will depend on students submitting ratings.
- Live ratings may be less useful when there are not many recent ratings for a location.
- The app will need information about campus locations.
- Campus information may come from Calvin resources, information entered by the development team, or a combination of sources.
- Users will need a Calvin email address to prove that they are connected to Calvin University.
- The exact way ratings will remain anonymous has not been decided yet.
- The use of the user's current location is optional and has not been fully decided yet.

---

# 3. System Features and Requirements

## 3.1 Functional Requirements

### 3.1.1 Numbered Requirements

- **FR-01: View Campus Places**  
  The app will allow users to browse a list of campus places.

- **FR-02: View Place Information**  
  The app will allow users to select a place and see information about it, including what the place is normally used for.

- **FR-03: View Ratings**  
  The app will allow users to see ratings that other students have submitted for a place.

- **FR-04: Submit Ratings**  
  The app will allow verified Calvin students to submit ratings for campus places.

- **FR-05: Different Rating Types**  
  The app will support both number-based and category-based ratings. The type of rating may be different depending on the location.

- **FR-06: Current Activity Ratings**  
  For locations where it makes sense, Calvin students will be able to submit ratings about how busy or crowded the location currently is.

- **FR-07: Calvin Verification**  
  The app will use a Calvin email address to verify that a user is connected to Calvin University.

- **FR-08: Recent Information**  
  When possible, the app should show recent ratings so users can understand the current state of a location instead of only seeing old information.

- **FR-09: Highest Rated Places**  
  The app will allow users to view campus places based on their ratings so that highly rated places are easy to find.

- **FR-10: Basic Navigation**  
  Users will be able to move between the main screens of the app, such as the home screen, places, ratings, and other major sections.

### 3.1.2 EARS Format Requirements

- **EARS-01:** When a user selects a campus place, the app will display information about that place.
- **EARS-02:** When a user views a rated campus place, the app will display available ratings for that location.
- **EARS-03:** When a verified Calvin student submits a valid rating, the app will save the rating for the selected location.
- **EARS-04:** When a location has different rating categories, the app will display the rating options that belong to that location.
- **EARS-05:** When a user needs to prove Calvin membership, the app will use their Calvin email address for verification.
- **EARS-06:** When recent ratings are available, the app will use them to help show the current condition of the location.
- **EARS-07:** When a user views the highest-rated places, the app will organize places based on their rating information.

---

## 3.2 Non-Functional Requirements

### 3.2.1 Performance

- The app should load its main screens and information in a reasonable amount of time.
- Submitting and viewing ratings should not require long waiting times under normal conditions.
- The app should be able to handle multiple ratings for the same location.
- Recent ratings should appear soon after they are successfully submitted.

### 3.2.2 Security

- The app should limit its main rating features to Calvin-related users.
- A Calvin email address will be used to help verify users.
- The app should not publicly display private user information along with a rating.
- The exact way anonymous ratings will work has not been decided yet.
- The team will need to decide what user information is stored and what information other users can see.

### 3.2.3 Usability, Reliability, and Compliance

- The app should have a simple interface that is easy for Calvin students to understand.
- Users should be able to find a place and view its ratings without going through unnecessary steps.
- Buttons, ratings, place information, and navigation should be clearly labeled.
- The app should handle missing information without crashing.
- If a location does not have any recent ratings, the app should tell the user that recent rating information is not available.
- The app should work consistently on the mobile devices supported by the team's React Native and Expo setup.

---

## 3.4 System Features

### Campus Place Browsing

- Users will be able to browse locations around Calvin University.
- Each location can have its own page containing information and ratings.

### Place Information

- Campus locations will include descriptions that explain what the location is.
- Descriptions will explain what students normally use the location for.
- This feature is meant to be especially useful for students who are new to Calvin.

### Student Ratings

- Verified students will be able to submit ratings about campus locations.
- Ratings may use numbers, categories, or a combination of both.
- Different places may have different rating types depending on what information is useful for that location.

### Current Busyness

- Certain places may allow students to rate how busy they currently are.
- Students could report whether a location is empty, somewhat busy, or very busy.
- Other students can use recent ratings to decide whether they want to go there.
- This information will come from student ratings rather than an automatic system that counts people.

### Highest Rated Places

- Users will be able to find places that have received high ratings from Calvin students.
- The app can organize or rank locations based on their rating information.
- Users will be able to select a highly rated place to view more information about it.
- Rating information should update as new ratings are submitted.

### Calvin Student Verification

- The app will use Calvin email addresses to help limit participation to people connected to Calvin University.
- The exact login and account system may change as development continues.

### Location Features

- The team may use the current location of a user's device in the future.
- Location access is not currently required.
- The exact use of the location feature has not been decided yet.

---

# 4. Other Requirements

## 4.1 Database Requirements

The application will need a way to store information used by Calvin Ratings.

Stored information may include:

- Campus place names.
- Campus place descriptions.
- Rating categories for each place.
- Ratings submitted by users.
- The time a rating was submitted.
- Verified Calvin student accounts.

Each rating should be connected to the correct campus place.

The system should keep enough information about when a rating was submitted to tell the difference between recent and older ratings.

Stored rating information should also make it possible for the app to compare ratings and identify highly rated campus places.

The exact database and database structure have not been decided yet.

---

# User Stories

These user stories describe the main features from the student's point of view. These stories will also be used as the user story cards on the team's GitHub Project board.

---

## US-01: Browse Campus Places

**User Story:** As a user, I can browse places around campus so that I can find a location that fits what I want to do.

**Acceptance Criteria:**
- The user can open a list of campus places.
- Places have clear names.
- The user can select a place to see more information (US-02).

---

## US-02: View Place Information

**User Story:** As a user, I can read information about a campus place so that I can understand what the location is used for.

**Acceptance Criteria:**
- The user can select a campus place.
- The app displays basic information about the selected place.
- The information explains the general purpose of the location.

---

## US-03: View Recent Ratings

**User Story:** As a user, I can see recent ratings for a campus place so that I can decide whether I want to go there.

**Acceptance Criteria:**
- The user can view available ratings for a selected place.
- The app clearly shows the rating information.
- **Only verified Calvin students can see the owners of ratings. Unverified users cannot.**
- Recent ratings can be used to show the current condition of a location.
- If recent ratings are unavailable, the app makes that clear to the user.

---

## US-04: Submit a Rating

**User Story:** As a Calvin student, I can rate a campus place so that other students can see useful information about it.

**Acceptance Criteria:**
- The student can select a campus place.
- The student can choose from the rating types available for that place.
- Ratings can use numbers, categories, or both.
- The student can submit the completed rating.
- The rating is connected to the correct campus place.

---

## US-05: Create an Account

**User Story:** As a user, I can create an account so that I can become a verified Calvin student and access account features.

**Acceptance Criteria:**
- The app asks the user for a Calvin email address when verification is needed.
- The app checks whether the provided email is a Calvin email.
- Users who do not meet the verification requirement do not receive a verified account.
- Verified users can access features like creating and deleting ratings.

---

## US-06: View Highest Rated Places

**User Story:** As a user, I can see the highest rated places on campus so that I can quickly find places that other students recommend.

**Acceptance Criteria:**
- The user can view a list of highly rated campus places.
- Places are ranked or organized based on their ratings.
- The user can see the rating for each place.
- The user can select a place to view more information about it.
- The list updates as new ratings are added.

---

## US-07: Save Favorite Places

**User Story:** As a user, I can save my favorite places so that I can easily access them in my profile section.

**Acceptance Criteria:**
- Saved places are shown in the profile page and home page.
- Saved places are saved client-side if the user does not have an account.
- If a user with client-side information creates an account, they can move their client-side information to their new account, preserving saved places.

---

## US-08: Delete an Account

**User Story:** As a Calvin student, I can delete my account if I no longer want to have account information and features.

**Acceptance Criteria:**
- When requesting account deletion, the student will be notified that the account will be deleted in a week from the request time, in case they change their mind.
- All account information will be permanently deleted, except for ratings.
- Ratings associated with the account will be displayed as an "anonymous user" (see [US-09](#us-09-anonymous-ratings)).

---

## US-09: Anonymous Ratings

**User Story:** As a Calvin student, I can make anonymous ratings that are not publicly displayed with my account so that I can feel comfortable making ratings while protecting my privacy.

**Acceptance Criteria:**
- An anonymous rating's owner will not be displayed publicly.
- An anonymous rating's owner will still be stored internally for documentation purposes, and to mitigate the amount unhelpful ratings.
- Anonymous ratings will only apply to ratings created while the setting is enabled.

---

## US-10: Space Addition Suggestions

**User Story:** As a Calvin student, I can suggest a space addition if I see a study space that isn't already on the app, to better reflect the goal of the app.

**Acceptance Criteria:**
- A single student is limited to one space addition suggestion per day.
- The student can provide the name of the suggested study space.
- The student can provide a description for the suggested space and what it is normally used for.
- The student can provide amenities suggestions.
- Once submitted, the space will be displayed to other students to rate whether this is a helpful space, and any amenities to add or remove.
- If enough students rate it positively, it will be displayed as an official space.

---

## US-11: Space Removal Suggestions

**User Story:** As a Calvin student, I can suggest a space removal if I see a study space that is outdated or no longer exists, to better reflect the goal of the app.

**Acceptance Criteria:**
- A single student is limited to one space removal suggestion per day.
- The student can provide a reason for the removal suggestion.
- Once submitted, the suggestion will be reviewed and accepted or rejected by the admins/developers (this is a different review criteria to [US-10](#us-10-space-addition-suggestions)).

---

## US-12: Open Spot Push Notifications

**User Story:** As a Calvin student, I can receive a push notification when one of my favorite spots opens up.

**Acceptance Criteria:**
- When the number of reviews for a student's favorite space in a short time have dwindled (e.g., 20 reviews in the past hour, but < 3 reviews in the past 15 minutes), a student can receive a push notification suggesting that the place could be less busy.
- Push notifications can be disabled.

# Current Prototype Goal

The team's current goal is to create an `implementation` prototype version that implements more user stories, updates the RESTful API, and designs and implements a relational database. 

This prototype should:

- Implement Supabase database.
- Create a relationship between the database and server.
- Implement as many more user stories as time allows.

This prototype does not need to contain every feature described in this SRS.

Features that are not completed in this version can be added or improved during later development.

This SRS can also be updated as Team C makes more decisions about the application.
