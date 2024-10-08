import { FollowUpEmail } from "./emails/followup";
import SubscribeEmail from "./emails/subscribe";
import { WelcomeEmail } from "./emails/welcome";

export { WelcomeEmail, SubscribeEmail, FollowUpEmail };

export { sendEmail, sendEmailHtml } from "./emails/send";
