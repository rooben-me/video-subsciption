import { supabase } from "../../../utils/supabase";
import cookie from "cookie";
import initStripe from "stripe";
const handler = async (req, res) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const token = cookie.parse(req.headers.cookie)["sb:token"];

  supabase.auth.session = () => ({
    access_token: token,
  });

  const {
    data: { stripe_customer },
  } = await supabase
    .from("profile")
    .select("stripe_customer")
    .eq("id", user.id)
    .single();

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const { priceId } = req.query;

  lineItems = [{ price: priceId, quantity: 1 }];

  const session = stripe.checkout.sessions.create({
    customer: stripe_customer,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: "http://localhost:3000/payment/sucess",
    cancel_url: "http://localhost:3000/payment/cancelled",
  });

  res.send({
    id: session.id,
  });
};

export default handler;
