Design a complete responsive web application UI for a personal finance management platform called “FinanceFlow”. The application helps users manage income, expenses, budgets, analytics, categories, and financial goals. The app should feel modern, clean, trustworthy, student-friendly, and easy to use. It should work as a responsive web app for desktop, tablet, and mobile.

The main purpose of the application is to let users record financial transactions manually, organize income and expenses by category, control monthly budget limits, view charts and analytics, and use a Financial Goals Simulator that calculates whether a user can realistically reach a savings goal based on income, expenses, deadline, and spending habits.

Create every page, every reusable component, all states, and responsive layouts. Use a consistent design system with reusable Figma components.

GENERAL DESIGN STYLE

Use a modern financial dashboard style. The design should be minimal, clear, and not overloaded. Use soft background colors, white cards, rounded corners, subtle shadows, clean typography, and strong visual hierarchy.

Suggested color direction:
Primary color: blue or indigo, representing trust and finance.
Secondary color: green, representing income, savings, and success.
Danger color: red, representing expenses, overspending, and warnings.
Warning color: orange or yellow, representing budget limits and goal risk.
Neutral colors: white, light gray, dark navy, and slate gray.

Use responsive design:
Desktop: sidebar navigation on the left, main content on the right.
Tablet: collapsible sidebar or top navigation.
Mobile: bottom navigation bar with key pages, simplified cards, stacked sections, and full-width forms.

The app must include light mode as the default. Add optional dark mode components or show how the design system could support dark mode.

GLOBAL LAYOUT COMPONENTS

Create a main authenticated app layout with:

1. Left sidebar for desktop.
2. Top bar with page title, search, notification icon, profile menu, and date/month selector.
3. Main content area with cards and charts.
4. Responsive mobile bottom navigation.
5. Toast notifications.
6. Empty states.
7. Loading skeletons.
8. Error states.
9. Confirmation modals.
10. Form validation messages.

SIDEBAR COMPONENT

Desktop sidebar should include:

* App logo and name: FinanceFlow.
* Dashboard.
* Transactions.
* Budgets.
* Analytics.
* Financial Goals.
* Categories.
* Reports.
* Settings.
* Logout button.
* User profile preview at the bottom.

Sidebar behavior:

* Active page highlighted.
* Icons for every navigation item.
* Collapsed version with icons only.
* Mobile version replaced by bottom navigation.

TOP BAR COMPONENT

Create top bar with:

* Current page title.
* Search field: “Search transactions…”
* Month selector: “June 2026”.
* Notification bell.
* Add Transaction button.
* User avatar with dropdown.

Profile dropdown should include:

* My Profile.
* Settings.
* Dark Mode toggle.
* Logout.

AUTHENTICATION PAGES

Create the following pages:

1. Landing Page
   Purpose: introduce the app before login.
   Sections:

* Hero section with headline: “Take Control of Your Personal Finances”
* Subtitle explaining that the app helps users track income, expenses, budgets, analytics, and savings goals.
* Primary CTA: “Get Started”
* Secondary CTA: “View Demo”
* Feature cards:

  * Track income and expenses.
  * Set monthly budget limits.
  * Analyze spending habits.
  * Simulate financial goals.
* Screenshot mockup of dashboard.
* Simple footer.

Responsive:

* Desktop: hero text left, dashboard preview right.
* Mobile: stacked layout.

2. Login Page
   Components:

* Logo.
* Email input.
* Password input.
* Remember me checkbox.
* Forgot password link.
* Login button.
* Link to register.
* Error state for wrong credentials.
* Loading state for login button.

3. Register Page
   Components:

* Full name input.
* Email input.
* Password input.
* Confirm password input.
* Terms checkbox.
* Register button.
* Link to login.
* Password strength indicator.
* Validation messages.

4. Forgot Password Page
   Components:

* Email input.
* Send reset link button.
* Success message state.

5. Reset Password Page
   Components:

* New password input.
* Confirm password input.
* Save new password button.

DASHBOARD PAGE

Design the main dashboard as the home page after login.

Desktop layout:

* Top summary cards in a grid:

  1. Total Balance.
  2. Monthly Income.
  3. Monthly Expenses.
  4. Savings Rate.
* Each card should have icon, value, trend indicator, and comparison to previous month.

Main dashboard sections:

1. Spending Overview chart:

   * Line or bar chart showing income vs expenses over time.
   * Month filter.
2. Category Spending card:

   * Donut chart showing expenses by category.
   * Legend with category colors.
3. Budget Progress card:

   * List of budget categories with progress bars.
   * Warning indicator when spending reaches 80%.
   * Red indicator when budget is exceeded.
4. Recent Transactions:

   * Table on desktop.
   * Cards on mobile.
   * Columns: name, category, date, type, amount, actions.
5. Financial Goal Preview:

   * Shows active savings goal.
   * Progress bar.
   * Required monthly saving.
   * Status badge: “On Track”, “At Risk”, or “Unrealistic”.
   * Button: “Open Goal Simulator”.

Mobile dashboard:

* Summary cards become horizontal scroll or 2-column grid.
* Charts stack vertically.
* Recent transactions shown as compact cards.
* Add transaction button becomes floating action button.

TRANSACTIONS PAGE

Purpose: user can manage income and expenses.

Create page with:

* Header: “Transactions”
* Add Transaction button.
* Filters:

  * Date range.
  * Type: Income / Expense / All.
  * Category.
  * Amount range.
  * Search.
* Sort dropdown:

  * Newest first.
  * Oldest first.
  * Highest amount.
  * Lowest amount.

Transaction table desktop:
Columns:

* Transaction name.
* Category.
* Type.
* Date.
* Payment method.
* Amount.
* Notes icon.
* Actions: edit/delete.

Mobile:
Each transaction as a card:

* Icon/category.
* Name.
* Date.
* Amount.
* Category badge.
* Swipe or menu actions.

Transaction states:

* Empty state: “No transactions yet. Add your first transaction.”
* Loading state.
* Error state.
* Filtered no results state.

ADD / EDIT TRANSACTION MODAL OR PAGE

Create reusable transaction form component.

Fields:

* Transaction type: Income or Expense segmented control.
* Title.
* Amount.
* Category dropdown.
* Date picker.
* Payment method dropdown:

  * Cash.
  * Card.
  * Bank transfer.
  * Other.
* Notes textarea.
* Recurring transaction toggle.
* Save button.
* Cancel button.

Validation:

* Amount is required.
* Category is required.
* Date is required.
* Title is required.

Create two states:

* Add Transaction.
* Edit Transaction.

Delete confirmation modal:

* Title: “Delete transaction?”
* Text: “This action cannot be undone.”
* Buttons: Cancel, Delete.

CATEGORIES PAGE

Purpose: user can create and manage categories.

Create page:

* Header: “Categories”
* Add Category button.
* Category cards/grid.

Each category card:

* Icon.
* Category name.
* Type: Income or Expense.
* Monthly spending/income total.
* Number of transactions.
* Edit button.
* Delete button.

Default expense categories:

* Food.
* Transport.
* Rent.
* Utilities.
* Entertainment.
* Education.
* Shopping.
* Health.
* Subscriptions.
* Other.

Default income categories:

* Salary.
* Freelance.
* Scholarship.
* Gift.
* Other income.

Add/Edit Category modal:

* Category name.
* Category type.
* Icon selector.
* Color selector.
* Save button.

BUDGETS PAGE

Purpose: user sets spending limits by category.

Create page:

* Header: “Budgets”
* Month selector.
* Add Budget button.
* Budget overview card:

  * Total monthly budget.
  * Total spent.
  * Remaining amount.
  * Percentage used.

Budget category cards:
Each card includes:

* Category icon.
* Category name.
* Monthly limit.
* Spent amount.
* Remaining amount.
* Progress bar.
* Status badge:

  * Safe.
  * Near Limit.
  * Exceeded.
* Edit and delete buttons.

Budget warning logic shown visually:

* Below 70%: green.
* 70% to 89%: yellow/orange.
* 90% to 99%: warning.
* 100% or more: red.

Add/Edit Budget modal:

* Category dropdown.
* Monthly limit input.
* Month selector.
* Save button.

Budget alert component:

* Message: “You are close to your Food budget limit.”
* Show percentage used.
* CTA: “Review Transactions.”

ANALYTICS PAGE

Purpose: show clear financial insights.

Create page:

* Header: “Analytics”
* Date range selector.
* Export report button.

Sections:

1. Income vs Expense chart:

   * Bar chart or line chart.
   * Monthly comparison.

2. Spending by Category:

   * Donut chart.
   * Category legend.
   * Top category highlighted.

3. Weekly Spending Trend:

   * Line chart.

4. Cash Flow Summary:

   * Income.
   * Expenses.
   * Savings.
   * Net balance.

5. Insights Cards:

   * “You spent 22% more on Entertainment this month.”
   * “Food is your highest expense category.”
   * “Your savings rate improved by 8%.”
   * “You are close to exceeding 2 budgets.”

6. Top Expenses Table:

   * Highest expense transactions.

Mobile:
Charts should stack vertically. Filters should collapse into a filter sheet.

FINANCIAL GOALS PAGE

Purpose: manage savings goals.

Create page:

* Header: “Financial Goals”
* Add Goal button.
* Goal summary:

  * Total target amount.
  * Total saved.
  * Active goals.
  * Goals completed.

Goal cards:
Each card includes:

* Goal name.
* Target amount.
* Current saved amount.
* Deadline.
* Progress percentage.
* Required monthly saving.
* Status badge:

  * On Track.
  * At Risk.
  * Unrealistic.
  * Completed.
* Progress bar.
* Button: “Open Simulator.”
* Edit/delete actions.

Example goals:

* Buy a laptop.
* Travel to Japan.
* Emergency fund.
* University payment.

Empty state:

* Illustration.
* Text: “Create your first financial goal and see how realistic it is.”
* Button: “Create Goal.”

FINANCIAL GOAL SIMULATOR PAGE

This is the most important innovative feature. Design it as a dedicated page and also as a modal version that can open from a goal card.

Purpose:
The simulator helps the user understand whether a financial goal is realistic based on income, average expenses, available money, goal amount, deadline, and spending categories.

Create page:
Header:

* “Financial Goal Simulator”
* Subtitle: “Check if your goal is realistic and receive recommendations.”

Main layout desktop:
Left side: input form.
Right side: simulation result and recommendations.

Input form fields:

1. Goal name.
2. Target amount.
3. Current saved amount.
4. Deadline date.
5. Monthly income.
6. Average monthly expenses.
7. Optional: choose categories to reduce spending.
8. Button: “Run Simulation.”

Simulation calculations displayed:

* Months remaining.
* Required monthly saving.
* Available monthly money.
* Difference between required saving and available money.
* Realistic status.

Result card states:

State 1: On Track

* Green badge: “Goal is realistic”
* Message: “You can reach this goal with your current income and expenses.”
* Progress chart.
* Suggested monthly saving amount.

State 2: At Risk

* Orange badge: “Goal is possible but difficult”
* Message: “You need to reduce some expenses or extend the deadline.”
* Show shortage amount.
* Recommendations.

State 3: Unrealistic

* Red badge: “Goal is not realistic with current habits”
* Message: “Your available monthly money is lower than the required saving.”
* Suggest alternatives:

  * Extend deadline.
  * Reduce spending in selected categories.
  * Increase monthly income.
  * Lower target amount.

Recommendation cards:

* “Reduce Entertainment by 20% to save 36 GEL monthly.”
* “Extend your deadline by 3 months to make this goal realistic.”
* “Reduce subscription spending by 15%.”
* “Try saving 180 GEL monthly instead of 300 GEL.”

Charts:

1. Goal progress circular chart.
2. Required vs available monthly saving bar chart.
3. Category reduction impact chart.
4. Timeline projection chart showing savings growth month by month.

Simulator output component:

* Status badge.
* Monthly required saving.
* Available money.
* Shortage or surplus.
* Suggested new deadline.
* Recommended category cuts.
* Save plan button.

Create “Save Simulation as Goal” button.
Create “Update Existing Goal” button.

Goal Simulator mobile:

* Step-by-step wizard:
  Step 1: Goal details.
  Step 2: Income and expenses.
  Step 3: Results.
  Step 4: Recommendations.
* Bottom fixed action button.

REPORTS PAGE

Purpose: user can view and export simple financial reports.

Create page:

* Header: “Reports”
* Date range selector.
* Report type selector:

  * Monthly summary.
  * Category report.
  * Budget report.
  * Goal progress report.
* Generate Report button.
* Export PDF button.
* Export CSV button.

Report preview card:

* Total income.
* Total expenses.
* Net savings.
* Highest spending category.
* Budget status.
* Goal progress.
* Charts and small tables.

SETTINGS PAGE

Create settings page with tabs or sections:

1. Profile Settings

* Profile photo/avatar.
* Full name.
* Email.
* Save changes button.

2. Security

* Change password.
* Current password.
* New password.
* Confirm password.
* Enable/disable two-factor authentication placeholder.

3. Preferences

* Currency selector: GEL, USD, EUR.
* Default month view.
* Language selector placeholder.
* Dark mode toggle.
* Notification preferences.

4. Notifications

* Budget limit alerts.
* Goal progress reminders.
* Weekly summary emails.
* Monthly report reminders.

5. Data Management

* Export data.
* Delete account.
* Clear all transactions.

PROFILE PAGE

Create user profile page:

* Avatar.
* Name.
* Email.
* Account creation date.
* Financial summary:

  * Total transactions.
  * Active budgets.
  * Active goals.
  * Average monthly spending.
* Edit profile button.

NOTIFICATIONS PAGE OR PANEL

Create notification panel:

* Budget warning.
* Goal reminder.
* Monthly summary.
* Transaction added confirmation.
* Error notification.

Notification examples:

* “Food budget is 85% used.”
* “You need to save 300 GEL this month to stay on track.”
* “Your monthly report is ready.”
* “Transaction added successfully.”

REUSABLE COMPONENTS TO CREATE

Create these as Figma components with variants:

1. Button
   Variants:

* Primary.
* Secondary.
* Outline.
* Danger.
* Ghost.
* Disabled.
* Loading.

Sizes:

* Small.
* Medium.
* Large.

2. Input Field
   Variants:

* Default.
* Focused.
* Error.
* Disabled.
* With icon.
* Password field.

3. Select Dropdown

* Default.
* Open.
* Error.
* Disabled.

4. Date Picker

* Single date.
* Date range.

5. Card

* Default card.
* Summary card.
* Chart card.
* Warning card.
* Goal card.
* Budget card.

6. Badge
   Variants:

* Income.
* Expense.
* Safe.
* Warning.
* Exceeded.
* On Track.
* At Risk.
* Unrealistic.
* Completed.

7. Progress Bar
   Variants:

* Green.
* Yellow.
* Orange.
* Red.
* Goal progress.
* Budget progress.

8. Modal
   Variants:

* Small confirmation.
* Medium form modal.
* Large simulator modal.

9. Table

* Header.
* Row.
* Empty state.
* Loading state.
* Action menu.

10. Transaction Item

* Desktop row.
* Mobile card.

11. Chart Placeholder Components

* Donut chart.
* Bar chart.
* Line chart.
* Circular progress chart.

12. Navigation

* Desktop sidebar.
* Collapsed sidebar.
* Mobile bottom nav.
* Top bar.

13. Toast Notification

* Success.
* Error.
* Warning.
* Info.

14. Empty State

* No transactions.
* No goals.
* No budgets.
* No reports.

15. Loading Skeleton

* Dashboard card skeleton.
* Table skeleton.
* Chart skeleton.

16. Avatar

* Image avatar.
* Initials avatar.
* Profile dropdown avatar.

17. Search Bar

* Default.
* Focused.
* With clear button.

18. Filter Panel

* Desktop horizontal filters.
* Mobile bottom sheet filters.

19. Confirmation Dialog

* Delete transaction.
* Delete budget.
* Delete goal.
* Delete account.

20. Floating Action Button

* Mobile add transaction.
* Mobile add goal.

DATA EXAMPLES TO SHOW IN DESIGN

Use Georgian Lari as the default currency: GEL or ₾.

Example transaction data:

* Salary, Income, ₾2,000, June 1.
* Groceries, Food, -₾120, June 3.
* Bus Card, Transport, -₾30, June 4.
* Netflix, Subscriptions, -₾25, June 5.
* Restaurant, Food, -₾80, June 7.
* Freelance Project, Income, ₾500, June 10.
* Gym, Health, -₾70, June 12.
* Books, Education, -₾90, June 13.

Example budget data:

* Food: limit ₾500, spent ₾420.
* Transport: limit ₾150, spent ₾90.
* Entertainment: limit ₾200, spent ₾180.
* Subscriptions: limit ₾80, spent ₾95.
* Education: limit ₾250, spent ₾90.

Example goal data:
Goal: Buy a Laptop.
Target amount: ₾3,000.
Current saved: ₾600.
Deadline: 10 months.
Required monthly saving: ₾240.
Available monthly money: ₾180.
Status: At Risk.
Recommendation: Reduce Entertainment by 20% and extend deadline by 2 months.

USER FLOW

Design the full user flow:

1. User opens landing page.
2. User registers or logs in.
3. User lands on dashboard.
4. User adds income and expense transactions.
5. User creates categories if needed.
6. User sets monthly budget limits.
7. User views dashboard and analytics.
8. User creates a financial goal.
9. User opens Financial Goal Simulator.
10. User enters goal amount, deadline, income, and expenses.
11. System shows whether goal is realistic.
12. User receives recommendations.
13. User saves the simulation as a goal.
14. User tracks goal progress over time.
15. User exports monthly report.

RESPONSIVE REQUIREMENTS

Desktop:

* 1440px wide layout.
* Sidebar visible.
* Dashboard cards in 4-column grid.
* Charts in 2-column layout.
* Tables visible.

Tablet:

* 768px layout.
* Sidebar collapses.
* Dashboard cards in 2-column grid.
* Tables can become simplified.
* Filters can wrap.

Mobile:

* 375px layout.
* Bottom navigation.
* No sidebar.
* Cards stacked vertically.
* Tables replaced by cards.
* Add buttons as floating action buttons.
* Forms become full-screen sheets or pages.
* Goal simulator becomes step-by-step wizard.

ACCESSIBILITY REQUIREMENTS

Use:

* High contrast text.
* Clear button labels.
* Large touch targets on mobile.
* Visible focus states.
* Clear validation messages.
* Icons with text labels.
* Color should not be the only way to show warning or success; also use text badges.

PAGE LIST TO GENERATE

Generate these pages as separate Figma frames:

1. Landing Page - Desktop.
2. Landing Page - Mobile.
3. Login Page - Desktop.
4. Login Page - Mobile.
5. Register Page - Desktop.
6. Register Page - Mobile.
7. Dashboard - Desktop.
8. Dashboard - Tablet.
9. Dashboard - Mobile.
10. Transactions - Desktop.
11. Transactions - Mobile.
12. Add Transaction Modal.
13. Edit Transaction Modal.
14. Delete Transaction Confirmation Modal.
15. Categories - Desktop.
16. Categories - Mobile.
17. Add Category Modal.
18. Budgets - Desktop.
19. Budgets - Mobile.
20. Add Budget Modal.
21. Analytics - Desktop.
22. Analytics - Mobile.
23. Financial Goals - Desktop.
24. Financial Goals - Mobile.
25. Financial Goal Simulator - Desktop.
26. Financial Goal Simulator - Mobile Wizard.
27. Reports - Desktop.
28. Reports - Mobile.
29. Settings - Desktop.
30. Settings - Mobile.
31. Profile Page.
32. Notification Panel.
33. Empty States.
34. Loading States.
35. Error States.
36. Design System / Component Library.

DESIGN SYSTEM PAGE

Create a separate design system frame containing:

* Color palette.
* Typography scale.
* Spacing scale.
* Buttons.
* Inputs.
* Dropdowns.
* Cards.
* Badges.
* Progress bars.
* Tables.
* Modals.
* Toasts.
* Navigation components.
* Chart components.
* Icons.
* Mobile navigation.
* Form components.

FINAL EXPECTATION

The final Figma file should look like a complete product design ready for frontend development in React and Tailwind CSS. Every page should be consistent, responsive, and component-based. The design should clearly show how the application works from registration to daily finance tracking, budgeting, analytics, and financial goal simulation.

Make the design practical, realistic, and suitable for a bachelor project presentation. Avoid overly complex banking features such as real bank API integration or payment processing. Focus on manual transaction entry, budget control, analytics, and the Financial Goals Simulator.
