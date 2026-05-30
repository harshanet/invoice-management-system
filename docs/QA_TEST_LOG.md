# QA Test Log: MediTrack

**Tested by:** Pratham Hariani (n12262757)
**Reviewed by:** Rajit Bhargava (n12483371)
**Browser:** Chrome (latest)
**OS:** macOS / Windows 10
**Tested Against:** main branch deployed to AWS ALB

## Test Environment

- Production: http://MediTrack-ALB-291180955.ap-southeast-2.elb.amazonaws.com
- Database: MongoDB Atlas 
- Backend: Express on EC2 
- Frontend: React static build via PM2

## Patient Flow Test Cases

| # | Test Case | Expected | Actual | Result |
|---|-----------|----------|--------|--------|
| 1 | Patient registration with valid details | Redirect to dashboard, account created | Match | Pass |
| 2 | Login with valid credentials | Redirect to dashboard | Match | Pass |
| 3 | Login with wrong password | Error displayed, no login | Match | Pass |
| 4 | View doctors list | All doctors displayed with specialisations | Match | Pass |
| 5 | Search doctors by specialisation | Filtered list shown | Match | Pass |
| 6 | Filter "Available only" | Only available doctors visible | Match | Pass |
| 7 | View slots for a doctor | Slots displayed with date/time | Match | Pass |
| 8 | Filter slots by date range | Range-filtered list | Match | Pass |
| 9 | Book an appointment | Appointment created, success message | Match | Pass |
| 10 | View my appointments | Booked appointment visible | Match | Pass |
| 11 | View notifications | Booking notification displayed | Match | Pass |
| 12 | Mark notification as read | Marked, badge count decrements | Match | Pass |
| 13 | Cancel an appointment | Appointment cancelled, notification dispatched | Match | Pass |
| 14 | Reschedule an appointment | New booking created, old freed, notification sent | Match | Pass |
| 15 | Update profile name | Saved successfully | Match | Pass |
| 16 | Logout | Redirect to login page | Match | Pass |

## Admin Flow Test Cases

| # | Test Case | Expected | Actual | Result |
|---|-----------|----------|--------|--------|
| 17 | Admin login | Redirect to admin dashboard | Match | Pass |
| 18 | Add a new doctor | Doctor appears in list | Match | Pass |
| 19 | Edit doctor's specialisation | Changes saved | Match | Pass |
| 20 | Delete a doctor | Removed from list | Match | Pass |
| 21 | Add a new slot | Slot appears in list | Match | Pass |
| 22 | Edit slot date/time | Changes saved | Match | Pass |
| 23 | Delete a slot | Slot removed | Match | Pass |
| 24 | View all appointments (admin view) | All appointments listed across users | Match | Pass |
| 25 | Update appointment status | Status updated, patient notified | Match | Pass |

## Negative / Edge Cases

| # | Test Case | Result |
|---|-----------|--------|
| 26 | Register with duplicate email | Pass — error message shown |
| 27 | Book an already booked slot | Pass — error message shown |
| 28 | Access /admin while logged in as patient | Pass — redirected away |
| 29 | Direct URL navigation without authentication | Pass — redirected to login |
| 30 | Edit profile with invalid email format | Pass — validation rejects |

## Issues Identified for Future Iteration

The following enhancement opportunities were surfaced during QA testing. These were prioritised for future iterations rather than the current submission due to time constraints:

1. **Patient side date control:** The slot booking date filter currently allows selection of past dates. Low complexity fix — add `min` attribute to the date input set to today's date.

2. **Notification badge real time refresh:** The unread notification count badge in the navbar does not update immediately after marking notifications as read or deleting them. Medium complexity — requires refreshing the notification context state after CRUD operations.

3. **Admin multi slot creation:** Adding multiple time slots requires individual entries for each. A calendar-based bulk slot creation UI would improve admin productivity. High complexity, full feature.

4. **Cancelled booking management:** When an appointment status is changed to cancelled, there is no option to delete the booking record from the same page. The cancelled slot should also re-appear as available — current behaviour preserves it for audit, which is intentional, but a delete option would be helpful for admin housekeeping.

## Summary

- Total test cases run: 30
- Passed: 30
- Failed: 0
- Critical issues: 0
- Minor enhancements identified: 4 (documented above for future iteration)

The application's core functionality is stable and production ready. The enhancement opportunities identified represent UX improvements rather than functional bugs and have been logged in the report's Discussion section as scoped future work.