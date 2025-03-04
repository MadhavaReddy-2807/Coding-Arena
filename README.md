# *Competitive Programming Arena*

A platform where users can create and participate in custom contests, track performance, and engage in problem-solving with *Codeforces integration*.
Link:-https://cparena.netlify.app/
(Backend takes more than
50 seconds for restart so please wait)
---

## *Features Implemented*

- ✅ *User Authentication* – Secure login using Clerk.
- ✅ *Custom Contest Creation* – Users can create private contests and share them with participants.
- ✅ *Automated Scoring & Penalty (ICPC Style)* – Tracks scores with penalties.
- ✅ *Friend System* – Users can add friends and view their progress.
- ✅ *Browse Problems by Tags* – Find problems by difficulty and topic.
- ✅ *Email Confirmation for Global Contests* – Participants receive a confirmation email.
- ✅ *Virtual Rating Graph* – Fetches Codeforces rating graph.
- ✅ *Heatmap from Codeforces* – Displays daily problem-solving streaks.
- ✅ *Problem Solving Analytics* – Graph showing problems solved in each contest.
- ✅ *Admin Controls* – Admins can create contests and notify all users via email.
- ✅ *Live Chat (Post-Contest)* – Users can discuss solutions after contests.

---

## *Tech Stack Used*

- *Frontend:* Next.js, ShadCN
- *Backend:* Node.js, Express.js
- *Database:* MongoDB
- *Authentication:* Clerk
- *Real-time Collaboration:* LiveBlocks
- *Email Notifications:* Nodemailer

---

## *Screenshots of Features*

### *1. Login Page*

![Login Page](assets/image.png)
Users can sign in through Google (Clerk Implementation)

### *2. Home Page*

![Home Page](assets/image-2.png)
After logging in, the user is redirected to the home page.

### *3. Dashboard*

![Dashboard](assets/image-3.png)
Users can update their Codeforces handle and save it. Below, past registered contests are displayed.

### *4. Analytics Page*

- Number of problems solved in each contest.
- Rating Change from the Codeforces API.
- Daily Problem Streak from Codeforces API.

![Analytics Graph 1](assets/image-5.png)
![Analytics Graph 2](assets/image-6.png)

### *5. Admin Panel*

![Admin Panel](assets/image-7.png)
Admins can start global contests, notify users via email, and select problems based on tags from Codeforces.

### *6. Contest Notification Email*

![Admin Email](assets/WhatsApp%20Image%202025-03-03%20at%2017.24.46_d4253ba0.jpg)

### *7. Contest Registration & Confirmation*

![Upcoming Contests](assets/image-8.png)
Users can view upcoming and live contests.

![Contest Registration](assets/image-9.png)
Users can register before the contest starts.

![Confirmation Email](assets/WhatsApp%20Image%202025-03-03%20at%2017.28.38_3235b58c.jpg)
After registration, users receive a confirmation email.

### *8. Contest Interface*

![Contest Options](assets/image-12.png)
Three main options: Problems, Participants, and Leaderboard.

![Leaderboard](assets/image-13.png)
Leaderboard updates automatically based on Codeforces verdicts.

### *9. Live Contest & Post-Contest Discussion*

![Live Contest](assets/image-14.png)
A "Live Now" indicator appears during active contests.

![Past Contests](assets/image-15.png)
After completion, contests are added to past contests.

![Live Chat](assets/image-16.png)
Users can engage in live chat post-contest via LiveBlocks.
![Live Chat](assets/image-17.png)

### *10. Friends & Social Features*

![Friends Page](assets/image-18.png)
Users can search for friends, add, or remove them.
![Friends Page](assets/image-19.png)

![Friend Profile](assets/image-20.png)
Clicking on a friend's profile redirects to their dashboard.

### *11. Problem Set & Custom Contests*

![Problem Set](assets/image-21.png)
![Problem Set](assets/image-22.png)
Users can browse problems by tags.

![Custom Contests](assets/image-23.png)
![Custom Contests](assets/image-24.png)
Users can create custom contests and share them with friends.
![Custom Contests](assets/image-25.png)

![Start Contest](assets/image-26.png)
Once started, the contest interface is the same as global contests.

---

### *How to Run the Project Locally*

1. Clone the repository:
   sh
   git clone https://github.com/MadhavaReddy-2807/Coding-Arena
   

2. Install dependencies:
   sh
   npm install
   

3. Run the development server:
   sh
   npm run dev
   

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### *Created with Love -Madhava Reddy*

Let me know if you need any additional improvements! 🚀