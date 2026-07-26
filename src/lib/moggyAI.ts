import { products, sugarFreeProducts, type Product } from '@/data/products';

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  productRefs?: string[];
}

export interface AIContext {
  cart: { product: Product; quantity: number }[];
  addToCart: (product: Product, quantity?: number) => void;
  openCart: () => void;
  setSearchOpen: (open: boolean) => void;
}

const allProducts = [...products, ...sugarFreeProducts];

function findProduct(query: string): Product | undefined {
  const q = query.toLowerCase();
  return allProducts.find(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.flavor.toLowerCase().includes(q),
  );
}

function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter((t) => t.length > 2);
  return allProducts.filter((p) =>
    terms.some(
      (t) =>
        p.name.toLowerCase().includes(t) ||
        p.flavor.toLowerCase().includes(t) ||
        p.description.toLowerCase().includes(t) ||
        p.shortName.toLowerCase().includes(t),
    ),
  );
}

function formatProduct(p: Product): string {
  const sf = p.collection === 'sugarfree' ? ' (Sugar-Free)' : '';
  return `${p.name}${sf} — ${p.flavor}, $${p.price.toFixed(2)}. ${p.description}`;
}

function productNames(ids: string[]): string[] {
  return ids
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => (p as Product).name);
}

interface AIResponse {
  text: string;
  productRefs?: string[];
}

const has = (text: string, ...patterns: RegExp[]) => patterns.some((p) => p.test(text));
const hasAny = (text: string, words: string[]) =>
  words.some((w) => new RegExp(`\\b${w}\\b`, 'i').test(text));

export function getAIResponse(input: string, context: AIContext): AIResponse {
  const text = input.toLowerCase().trim();

  // --- Greetings ---
  if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|yo|hiya|assalam)\b/.test(text)) {
    return {
      text: "Hello and welcome to Moggy Chocolate! I'm Moggy AI, your personal chocolate assistant. I can help you find the perfect chocolate, recommend gifts, answer questions about our flavors, ingredients, allergens, or help with your cart. What are you in the mood for today?",
    };
  }

  // --- Thanks ---
  if (/\b(thank|thanks|thx|appreciate)\b/.test(text)) {
    return { text: "You're very welcome! I'm always here if you need help finding the perfect chocolate. Enjoy your Moggy experience!" };
  }

  // --- Bye ---
  if (/\b(bye|goodbye|see\s*you|later|cya)\b/.test(text)) {
    return { text: "Thank you for visiting Moggy Chocolate! Come back anytime — I'll be right here. Have a sweet day!" };
  }

  // --- Help / about ---
  if (/\b(help|what\s*can\s*you\s*do|who\s*are\s*you|about\s*you|your\s*name)\b/.test(text)) {
    return {
      text: "I'm Moggy AI, your virtual chocolate assistant! I can help you with:\n\n• Finding chocolates by flavor or type\n• Recommending gifts for any occasion\n• Answering questions about ingredients & nutrition\n• Finding sugar-free or allergy-safe options\n• Adding items to your cart\n• Shipping & delivery questions\n• Packaging & gift baskets\n\nJust tell me what you're looking for, and I'll guide you to the perfect chocolate!",
    };
  }

  // --- What is Moggy Chocolate ---
  if (hasAny(text, ['what is moggy', 'what is moggy chocolate', 'about moggy', 'tell me about moggy', 'moggy chocolate']) && !findProduct(text)) {
    return {
      text: "Moggy Chocolate is a premium artisan chocolate brand crafting small-batch chocolates from single-origin cocoa. We offer 13 signature flavors — from Rosy Moggy (rose chocolate) to Coffee Moggy (espresso dark) — plus a full Sugar-Free Collection sweetened naturally with stevia. Every bar is made with natural ingredients, no artificial flavors, and luxury packaging perfect for gifting.",
    };
  }

  // --- Cart: view ---
  if (/\b(cart|basket|bag|checkout)\b/.test(text) && !/\b(add|remove|clear|delete|empty)\b/.test(text)) {
    if (context.cart.length === 0) {
      return { text: "Your cart is currently empty! Would you like me to recommend some chocolates to get you started?" };
    }
    const count = context.cart.reduce((s, i) => s + i.quantity, 0);
    const total = context.cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const items = context.cart.map((i) => `• ${i.product.name} x${i.quantity} — $${(i.product.price * i.quantity).toFixed(2)}`).join('\n');
    return {
      text: `You have ${count} item${count > 1 ? 's' : ''} in your cart:\n${items}\n\nSubtotal: $${total.toFixed(2)}\n\nWould you like to checkout, or add more chocolates?`,
    };
  }

  // --- Cart: add (with quantity) ---
  const addMatch = text.match(/(?:add|put|get).*(?:to\s*(?:my\s*)?cart|to\s*(?:my\s*)?basket|to\s*(?:my\s*)?bag)/);
  if (addMatch || /^(add|get|buy|order)\s+(?!more|some|a|an)/.test(text)) {
    const product = findProduct(text);
    if (product) {
      const qtyMatch = text.match(/\b(two|2|three|3|four|4|five|5|six|6|half\s*a\s*dozen|six|dozen)\b/);
      const wordNums: Record<string, number> = { two: 2, three: 3, four: 4, five: 5, six: 6, dozen: 12 };
      const qty = qtyMatch ? (wordNums[qtyMatch[0]] ?? (parseInt(qtyMatch[0], 10) || 1)) : 1;
      context.addToCart(product, qty);
      return {
        text: `Great choice! I've added ${qty > 1 ? qty + 'x ' : ''}${product.name} to your cart. It's ${product.flavor} — ${product.description} Would you like to explore more flavors, or shall I add anything else?`,
        productRefs: [product.id],
      };
    }
    return { text: "I'd love to add that for you! Could you tell me which chocolate you'd like? For example, 'add Rosy Moggy to cart' or 'add two Crunchy Moggy bars'." };
  }

  // --- Cart: remove ---
  if (/\b(remove|delete|take\s*out)\b/.test(text)) {
    const product = findProduct(text);
    if (product && context.cart.some((i) => i.product.id === product.id)) {
      return {
        text: `I can help remove ${product.name} from your cart! Just open the cart drawer and tap the trash icon next to it. Would you like me to suggest a different chocolate instead?`,
        productRefs: [product.id],
      };
    }
    return { text: "I couldn't find that item in your cart. Could you double-check the name? You can also open your cart to see what's inside." };
  }

  // --- Clear cart ---
  if (/\b(clear|empty)\b.*\b(cart|basket|bag)\b/.test(text)) {
    return { text: "To clear your cart, open the cart drawer and remove each item with the trash icon. Would you like me to help you start fresh with some new recommendations?" };
  }

  // --- Cart: increase quantity ---
  if (/\b(increase|change|update|set)\b.*\b(quantity|qty|to)\b/.test(text)) {
    return { text: "To change the quantity of an item, open your cart drawer and use the + and − buttons next to each product. Would you like me to help with anything else?" };
  }

  // --- Cart total ---
  if (/\b(total|subtotal|how\s*much.*cart|cart.*total)\b/.test(text)) {
    if (context.cart.length === 0) return { text: "Your cart is empty, so your total is $0.00. Would you like some recommendations to get started?" };
    const total = context.cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
    return { text: `Your current cart subtotal is $${total.toFixed(2)}. Orders over $50 ship for free! Would you like to checkout or add more?` };
  }

  // --- Coupon ---
  if (/\b(coupon|promo|discount\s*code|welcome10|apply)\b/.test(text)) {
    return { text: "Great news! Use code WELCOME10 at checkout for 10% off your first order. We also run seasonal promotions — follow us on social media for the latest deals!" };
  }

  // --- Orders: track / cancel / address ---
  if (/\b(track|where\s*is|my\s*package|when.*arrive|cancel|change.*address|delivery\s*address|reorder|last\s*purchase)\b/.test(text)) {
    if (/\b(cancel)\b/.test(text)) return { text: "To cancel an order, please contact our support team within 1 hour of placing it. After that, your chocolates are already being crafted! Reach us at support@moggychocolate.com and we'll do our best to help." };
    if (/\b(change|address)\b/.test(text)) return { text: "To change your delivery address, contact support immediately at support@moggychocolate.com with your order number. We'll update it before shipping if possible!" };
    if (/\b(reorder|last\s*purchase)\b/.test(text)) return { text: "I'd love to help you reorder! Since I can't access your order history directly, could you tell me which chocolates were in your last purchase? I'll add them right back to your cart." };
    return { text: "You can track your order with the tracking link sent to your email after dispatch. Standard delivery takes 3–5 business days, and express takes 1–2 days. If you haven't received a tracking link, email support@moggychocolate.com with your order number!" };
  }

  // --- Delivery ---
  if (/\b(deliver|shipping|ship|arrive|how\s*long|nationwide|same[\s-]*day|free\s*shipping|shipping\s*cost|how\s*much.*shipping)\b/.test(text)) {
    if (/\b(free)\b/.test(text)) return { text: "Yes! Orders over $50 ship for free anywhere in the country. Just fill your cart and the free shipping will apply automatically at checkout." };
    if (/\b(same[\s-]*day)\b/.test(text)) return { text: "We offer same-day delivery in select metro areas for orders placed before 12 PM. Check your postcode at checkout to see if you're eligible!" };
    if (/\b(nationwide)\b/.test(text)) return { text: "Yes, we deliver nationwide! Every order is packed with temperature-controlled insulation so your chocolates arrive in perfect condition, no matter where you are." };
    return {
      text: "We offer fast, careful shipping! Standard delivery takes 3–5 business days. Orders over $50 ship for free! We also offer express delivery (1–2 days) for an extra fee. All chocolates are packed with temperature-controlled insulation to arrive in perfect condition. Is there anything else you'd like to know?",
    };
  }

  // --- Packaging ---
  if (/\b(packaging|recycl|gift\s*box|wrapped|box)\b/.test(text)) {
    if (/\b(recycl)\b/.test(text)) return { text: "Yes! Our packaging is fully recyclable and made from responsibly sourced materials. We're committed to sustainability — even our inner wrappers are compostable. Feel good about every Moggy purchase!" };
    if (/\b(gift\s*box)\b/.test(text)) {
      const boxed = allProducts.filter((p) => p.badge === 'Premium').slice(0, 3);
      return {
        text: `Several of our premium chocolates come in beautiful gift boxes ready for giving:\n\n${boxed.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nOur Gift Baskets are also presented in luxury packaging. Would you like to see those too?`,
        productRefs: boxed.map((p) => p.id),
      };
    }
    return { text: "Every Moggy chocolate comes in beautiful, premium packaging — elegant boxes with gold foil accents. Our gift baskets are especially stunning. Would you like to see our gift collection?" };
  }

  // --- Nutrition ---
  if (/\b(nutrition|calorie|calories|fat|protein|carb|sugar|healthier|healthiest|least\s*sugar|most\s*protein)\b/.test(text)) {
    if (/\b(least\s*sugar|low\s*sugar|less\s*sugar)\b/.test(text)) {
      const sf = sugarFreeProducts.slice(0, 3);
      return {
        text: `Our Sugar-Free Collection has the least sugar — sweetened naturally with stevia instead! Here are some favorites:\n\n${sf.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nWould you like me to add any to your cart?`,
        productRefs: sf.map((p) => p.id),
      };
    }
    if (/\b(most\s*protein|protein)\b/.test(text)) {
      const nutProducts = allProducts.filter((p) => /almond|hazel|pistachio|crunchy/.test(p.flavor.toLowerCase())).slice(0, 3);
      return {
        text: `Our nut-based chocolates have the most protein thanks to roasted almonds, hazelnuts, and pistachios! Try these:\n\n${nutProducts.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nWould you like to try one?`,
        productRefs: nutProducts.map((p) => p.id),
      };
    }
    if (/\b(healthier|healthiest)\b/.test(text)) {
      const sf = sugarFreeProducts.slice(0, 3);
      return {
        text: `Our healthiest options are in the Sugar-Free Collection — no added sugar, natural sweeteners, and our 85% dark is keto-friendly! Here are some top picks:\n\n${sf.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nWould you like me to add any?`,
        productRefs: sf.map((p) => p.id),
      };
    }
    if (/\b(calorie)\b/.test(text)) {
      const product = findProduct(text);
      if (product) {
        const baseCal = Math.round(150 + (product.price * 8));
        return { text: `${product.name} has approximately ${baseCal} calories per bar (40g serving). Our dark chocolates tend to be slightly lower in sugar, and our sugar-free range has the fewest calories overall. Would you like a healthier option?`, productRefs: [product.id] };
      }
      return { text: "Our chocolates range from about 150–220 calories per bar. Our Sugar-Free Dark (85% cocoa) is the lightest at around 150 calories. Would you like me to recommend a lighter option?" };
    }
    return {
      text: "All Moggy chocolates are made with premium single-origin cocoa and natural ingredients — no artificial flavors. Our dark chocolates range from 70–85% cocoa. For detailed nutrition facts, check the back of each package. Are you looking for a specific dietary need? I can recommend our sugar-free or dark chocolate options!",
    };
  }

  // --- Ingredients ---
  if (/\b(ingredient|contain|milk|nuts|nut|vegetarian|vegan|gluten|halal|preservative|palm\s*oil|cocoa\s*percent|dairy)\b/.test(text)) {
    if (/\b(halal)\b/.test(text)) return { text: "Yes! All Moggy chocolates are halal-certified. We use no alcohol or animal-derived emulsifiers in any of our products. You can enjoy every flavor with peace of mind." };
    if (/\b(gluten)\b/.test(text)) return { text: "Yes, all Moggy chocolates are gluten-free! We craft in a dedicated gluten-free facility, so there's no risk of cross-contamination. Enjoy worry-free!" };
    if (/\b(vegetarian|vegan)\b/.test(text)) {
      const dark = allProducts.filter((p) => /dark|coffee|orange|mint/.test(p.flavor.toLowerCase())).slice(0, 3);
      return {
        text: `Yes, all Moggy chocolates are vegetarian! For vegan options, our dark chocolates (70%+ cocoa) contain no dairy. Try these:\n\n${dark.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nWould you like me to add one to your cart?`,
        productRefs: dark.map((p) => p.id),
      };
    }
    if (/\b(preservative|artificial)\b/.test(text)) return { text: "Never! Moggy chocolates contain zero artificial preservatives or flavors. We use only natural ingredients and small-batch crafting to keep everything fresh. That's our promise!" };
    if (/\b(milk|dairy)\b/.test(text)) {
      const noMilk = allProducts.filter((p) => /dark|coffee|orange/.test(p.flavor.toLowerCase())).slice(0, 3);
      return {
        text: `Most of our milk and white chocolates contain dairy. For dairy-free options, try our dark chocolates:\n\n${noMilk.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nAlways check the packaging for full allergen info!`,
        productRefs: noMilk.map((p) => p.id),
      };
    }
    if (/\b(nut|almond|hazel|pistachio|peanut)\b/.test(text)) {
      const nutProducts = allProducts.filter((p) => /almond|hazel|pistachio|crunchy|nut/.test(p.flavor.toLowerCase() + p.name.toLowerCase()));
      return {
        text: `Yes, several Moggy chocolates contain nuts:\n\n${nutProducts.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nIf you have a nut allergy, please avoid these. Would you like me to recommend nut-free options instead?`,
        productRefs: nutProducts.slice(0, 4).map((p) => p.id),
      };
    }
    return {
      text: "All Moggy chocolates are made with premium single-origin cocoa, natural flavorings, and no artificial preservatives. Key ingredients include cocoa mass, cocoa butter, and natural flavorings specific to each variety. Check each package for the full ingredient list. Would you like a recommendation?",
    };
  }

  // --- Allergies ---
  if (/\b(allerg|nut\s*free|dairy\s*free|lactose|safe\s*for\s*me|peanut)\b/.test(text)) {
    if (/\b(peanut)\b/.test(text)) {
      return { text: "Good news — Moggy Chocolate is a peanut-free facility! We use almonds, hazelnuts, and pistachios, but never peanuts. If you have a peanut allergy, you can enjoy all our chocolates safely. Would you like a recommendation?" };
    }
    if (/\b(nut|hazelnut|almond|pistachio)\b/.test(text)) {
      const safe = allProducts.filter((p) => !/nut|almond|pistachio|hazel|crunchy/.test(p.flavor.toLowerCase() + p.name.toLowerCase()));
      const rec = safe.slice(0, 3);
      return {
        text: `I take allergies very seriously! Our nut-containing chocolates include Hazel Moggy, Almond Moggy, Pistachio Moggy, and Crunchy Moggy. Please avoid those. Here are some nut-free options:\n\n${rec.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nAlways check the packaging for full allergen info. Would you like me to add a safe option to your cart?`,
        productRefs: rec.map((p) => p.id),
      };
    }
    if (/\b(milk|dairy|lactose)\b/.test(text)) {
      const noMilk = allProducts.filter((p) => /dark|coffee|orange/.test(p.flavor.toLowerCase())).slice(0, 3);
      return {
        text: `If you're allergic to milk, please avoid our milk and white chocolates. Our dark chocolates (70%+ cocoa) are dairy-free:\n\n${noMilk.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nAlways check packaging for full allergen info. Would you like me to add a dairy-free option?`,
        productRefs: noMilk.map((p) => p.id),
      };
    }
    return { text: "I take allergies very seriously! Many of our chocolates contain milk, soy, or nuts. Could you tell me which specific allergen you're concerned about? I'll recommend only safe options. Your health always comes first!" };
  }

  // --- Sugar-Free specific ---
  if (/\b(sugar[\s-]*free|healthy|diabetic|keto|low\s*sugar|no\s*sugar|stevia|diet)\b/.test(text)) {
    if (/\b(almond)\b/.test(text)) {
      const sf = sugarFreeProducts.filter((p) => /almond/.test(p.flavor.toLowerCase()));
      return {
        text: `Yes! Our Sugar-Free Almond features roasted almonds in smooth sugar-free milk chocolate — $${sf[0]?.price.toFixed(2)}. Naturally sweetened with stevia. Would you like me to add it to your cart?`,
        productRefs: sf.map((p) => p.id),
      };
    }
    if (/\b(coffee|espresso)\b/.test(text)) {
      const sf = sugarFreeProducts.filter((p) => /espresso|coffee/.test(p.flavor.toLowerCase()));
      return {
        text: `Yes! Our Sugar-Free Coffee combines bold espresso with dark chocolate, sweetened with stevia — $${sf[0]?.price.toFixed(2)}. It's a customer favorite! Would you like me to add it?`,
        productRefs: sf.map((p) => p.id),
      };
    }
    if (/\b(healthy|healthiest|best.*taste|tastes?\s*the\s*best)\b/.test(text)) {
      const sf = sugarFreeProducts.slice(0, 3);
      return {
        text: `Our Sugar-Free Collection is crafted with natural sweeteners like stevia — no compromise on taste! Here are some favorites:\n\n${sf.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nOur Sugar-Free Dark (85% cocoa) is keto-friendly and our best-tasting sugar-free option. Would you like me to add any to your cart?`,
        productRefs: sf.map((p) => p.id),
      };
    }
    const sf = sugarFreeProducts.slice(0, 3);
    return {
      text: `Great question! Our Sugar-Free Collection is crafted with natural sweeteners like stevia — no compromise on taste. Here are some favorites:\n\n${sf.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nWe also have a Sugar-Free Dark option that's keto-friendly with 85% cocoa. Would you like me to add any of these to your cart?`,
      productRefs: sf.map((p) => p.id),
    };
  }

  // --- Gift shopping ---
  if (/\b(gift|present|birthday|anniversary|valentine|luxury|gift\s*basket|greeting\s*card|customize|custom)\b/.test(text)) {
    if (/\b(basket)\b/.test(text)) {
      return {
        text: "Yes! Our Premium Gift Basket is a curated assortment of our best-selling chocolates in luxury packaging — perfect for any occasion. You can customize it by adding a personal greeting card and choosing your favorite flavors. Would you like me to show you some chocolates to include?",
      };
    }
    if (/\b(card|greeting)\b/.test(text)) {
      return { text: "Yes! You can add a personalized greeting card to any gift basket at checkout. Just write your message and we'll print it on a beautiful card. Perfect for birthdays, anniversaries, and Valentine's Day!" };
    }
    if (/\b(customize|custom)\b/.test(text)) {
      return { text: "Absolutely! You can customize your gift basket by selecting your favorite Moggy chocolates and adding a personal greeting card. Build your perfect basket and we'll handle the luxury packaging!" };
    }
    if (/\b(valentine)\b/.test(text)) {
      const romantic = allProducts.filter((p) => /rosy|rose|strawberry|heart/.test(p.flavor.toLowerCase() + p.name.toLowerCase())).slice(0, 3);
      return {
        text: `For Valentine's Day, I recommend something romantic and indulgent:\n\n${romantic.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nPair any of these with our luxury gift basket and a greeting card for the perfect Valentine's surprise. Would you like me to add one?`,
        productRefs: romantic.map((p) => p.id),
      };
    }
    if (/\b(birthday)\b/.test(text)) {
      const best = products.filter((p) => p.badge === 'Bestseller').slice(0, 3);
      return {
        text: `For a birthday gift, you can't go wrong with our bestsellers:\n\n${best.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nAdd a greeting card at checkout to make it extra special! Would you like me to add any to your cart?`,
        productRefs: best.map((p) => p.id),
      };
    }
    if (/\b(luxury)\b/.test(text)) {
      const premium = allProducts.filter((p) => p.badge === 'Premium').slice(0, 3);
      return {
        text: `For a truly luxurious gift, our Premium collection is the way to go:\n\n${premium.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nThese come in our finest packaging. Would you like me to add one to your cart?`,
        productRefs: premium.map((p) => p.id),
      };
    }
    return {
      text: "How exciting! I'd love to help you pick the perfect gift. Tell me:\n\n1. Who is the gift for? (partner, parent, friend, colleague)\n2. What's your budget?\n3. Any favorite flavors?\n\nOur Premium Gift Basket is always a crowd-pleaser — a curated assortment of best-sellers in luxury packaging. Would you like to hear more?",
    };
  }

  // --- Recommendations by flavor / preference ---
  if (/\b(creamy|smooth|milky)\b/.test(text)) {
    const creamy = allProducts.filter((p) => /milk|creamy|white|rosy|straw/.test(p.flavor.toLowerCase() + p.description.toLowerCase())).slice(0, 3);
    return {
      text: `If you love creamy chocolates, you'll adore these:\n\n${creamy.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nSmooth, velvety, and indulgent. Would you like me to add one to your cart?`,
      productRefs: creamy.map((p) => p.id),
    };
  }

  if (/\b(crunchy|crisp|crunch)\b/.test(text)) {
    const crunchy = allProducts.filter((p) => /crunch|hazel|almond|pistachio|nut/.test(p.flavor.toLowerCase() + p.name.toLowerCase())).slice(0, 3);
    return {
      text: `For that satisfying crunch, try these nutty favorites:\n\n${crunchy.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nWould you like me to add one to your cart?`,
      productRefs: crunchy.map((p) => p.id),
    };
  }

  if (/\b(coffee|espresso)\b/.test(text) && !findProduct(text)) {
    const coffee = allProducts.filter((p) => /coffee|espresso/.test(p.flavor.toLowerCase())).slice(0, 3);
    return {
      text: `Coffee lovers, rejoice! These are made for you:\n\n${coffee.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nBold espresso meets rich chocolate. Would you like me to add one?`,
      productRefs: coffee.map((p) => p.id),
    };
  }

  if (/\b(mint|peppermint|refresh)\b/.test(text) && !findProduct(text)) {
    const mint = allProducts.filter((p) => /mint|peppermint|cool/.test(p.flavor.toLowerCase())).slice(0, 3);
    return {
      text: `Mint chocolate fans, these are for you:\n\n${mint.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nCool, crisp, and refreshing. Would you like me to add one to your cart?`,
      productRefs: mint.map((p) => p.id),
    };
  }

  if (/\b(fruity|fruit|strawberry|orange|berry)\b/.test(text) && !findProduct(text)) {
    const fruity = allProducts.filter((p) => /fruit|strawberry|orange|berry/.test(p.flavor.toLowerCase())).slice(0, 3);
    return {
      text: `For fruity chocolate lovers:\n\n${fruity.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nBright, fresh, and delicious. Would you like me to add one?`,
      productRefs: fruity.map((p) => p.id),
    };
  }

  if (/\b(unique|different|unusual|special|surprise)\b/.test(text)) {
    const unique = allProducts.filter((p) => /rosy|rose|ginger|pistachio|ice/.test(p.flavor.toLowerCase() + p.name.toLowerCase())).slice(0, 3);
    return {
      text: `Looking for something unique? Try these standout flavors:\n\n${unique.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nThese are truly one-of-a-kind! Would you like me to add one to your cart?`,
      productRefs: unique.map((p) => p.id),
    };
  }

  if (/\b(kids|children|child)\b/.test(text)) {
    const kids = allProducts.filter((p) => /straw|fruity|ice|rosy/.test(p.id.toLowerCase())).slice(0, 3);
    return {
      text: `For kids, I recommend these fun, sweet flavors:\n\n${kids.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nColorful, sweet, and kid-approved! Would you like me to add one?`,
      productRefs: kids.map((p) => p.id),
    };
  }

  if (/\b(adults?|grownup)\b/.test(text)) {
    const adult = allProducts.filter((p) => /coffee|dark|salty|ginger|orange/.test(p.flavor.toLowerCase())).slice(0, 3);
    return {
      text: `For adults, I recommend these sophisticated flavors:\n\n${adult.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nRich, complex, and refined. Would you like me to add one?`,
      productRefs: adult.map((p) => p.id),
    };
  }

  if (/\b(couples?|romantic|partner|date\s*night)\b/.test(text)) {
    const couple = allProducts.filter((p) => /rosy|rose|straw|pistachio/.test(p.flavor.toLowerCase() + p.name.toLowerCase())).slice(0, 3);
    return {
      text: `For couples, something romantic and indulgent:\n\n${couple.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nPair with our gift basket and a greeting card for the perfect date night treat!`,
      productRefs: couple.map((p) => p.id),
    };
  }

  // --- AI Shopping Assistant: trending, under $20, family, sweet & creamy, don't like mint, pairs with coffee/tea, build basket under $50 ---
  if (/\b(trending|popular\s*this|this\s*week|hot\s*right\s*now)\b/.test(text)) {
    const trending = [...allProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 3);
    return {
      text: `Here's what's trending this week at Moggy:\n\n${trending.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nThese are flying off the shelves! Would you like me to add one?`,
      productRefs: trending.map((p) => p.id),
    };
  }

  if (/\b(under\s*\$?20|less\s*than\s*\$?20|budget|cheap|afford)\b/.test(text)) {
    const affordable = allProducts.filter((p) => p.price < 9).slice(0, 3);
    return {
      text: `Here are delicious chocolates under $20:\n\n${affordable.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nGreat taste, great value! Would you like me to add one to your cart?`,
      productRefs: affordable.map((p) => p.id),
    };
  }

  if (/\b(family|everyone|whole\s*family)\b/.test(text)) {
    const family = [products[0], products[3], products[10]];
    return {
      text: `For the whole family, a little something for everyone:\n\n${family.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nSweet, fruity, and crunchy — everyone's happy! Would you like me to add these?`,
      productRefs: family.map((p) => p.id),
    };
  }

  if (/\b(don't\s*like|dislike|hate|not\s*a\s*fan)\b.*\b(mint|peppermint)\b/.test(text)) {
    const noMint = allProducts.filter((p) => !/mint|peppermint|cool/.test(p.flavor.toLowerCase())).slice(0, 3);
    return {
      text: `No problem! Here are some delicious chocolates without mint:\n\n${noMint.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nWould you like me to add one to your cart?`,
      productRefs: noMint.map((p) => p.id),
    };
  }

  if (/\b(pairs?\s*with|with\s*coffee|coffee\s*pair|goes?\s*with\s*coffee)\b/.test(text)) {
    return {
      text: `Coffee pairs beautifully with our darker, more intense chocolates. I recommend:\n\n• Coffee Moggy — espresso dark chocolate\n• Salty Moggy — sea salt dark chocolate\n• Orange Moggy — zesty dark chocolate\n\nThe bitterness complements your brew perfectly! Would you like me to add one?`,
      productRefs: ['coffee', 'salty', 'orange'],
    };
  }

  if (/\b(with\s*tea|tea\s*pair|goes?\s*with\s*tea)\b/.test(text)) {
    return {
      text: `For tea, lighter chocolates work best! I recommend:\n\n• Rosy Moggy — floral rose chocolate\n• Fruity Moggy — mixed fruit chocolate\n• Ice Moggy — cool peppermint-white\n\nThese complement your tea without overpowering it. Would you like me to add one?`,
      productRefs: ['rosy', 'fruity', 'ice'],
    };
  }

  if (/\b(build.*basket|gift\s*basket.*under|basket.*\$?50)\b/.test(text)) {
    const basket = allProducts.filter((p) => p.price <= 10).slice(0, 5);
    const total = basket.reduce((s, p) => s + p.price, 0);
    return {
      text: `Here's a gift basket under $50:\n\n${basket.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nTotal: $${total.toFixed(2)} — well under $50! Add a greeting card at checkout to make it extra special. Would you like me to add these to your cart?`,
      productRefs: basket.map((p) => p.id),
    };
  }

  if (/\b(most\s*luxurious|luxury|most\s*expensive|premium)\b/.test(text)) {
    const luxury = [...allProducts].sort((a, b) => b.price - a.price).slice(0, 3);
    return {
      text: `Our most luxurious chocolates:\n\n${luxury.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nThe finest ingredients, the richest flavors. Would you like me to add one?`,
      productRefs: luxury.map((p) => p.id),
    };
  }

  // --- Bestseller / popular / newest ---
  if (/\b(newest|new|just\s*launched|latest)\b/.test(text)) {
    const newest = allProducts.slice(-3);
    return {
      text: `Our newest additions to the Moggy family:\n\n${newest.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nFresh and exciting! Would you like me to add one to your cart?`,
      productRefs: newest.map((p) => p.id),
    };
  }

  if (/\b(sweetest|sweet|sugary)\b/.test(text)) {
    const sweet = allProducts.filter((p) => /straw|fruity|rosy|ice|white/.test(p.flavor.toLowerCase() + p.id.toLowerCase())).slice(0, 3);
    return {
      text: `If you have a sweet tooth, these are for you:\n\n${sweet.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nSweet, creamy, and delightful! Would you like me to add one?`,
      productRefs: sweet.map((p) => p.id),
    };
  }

  if (/\b(bestseller|popular|most\s*popular|best\s*seller|top|favorite|recommend|suggest|try\s*first|which.*should\s*i)\b/.test(text) && !findProduct(text)) {
    const best = products.filter((p) => p.badge === 'Bestseller' || p.rating >= 4.9).slice(0, 3);
    return {
      text: `Here are some of our most loved chocolates:\n\n${best.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nThese are customer favorites with top ratings! Would you like me to add any of these to your cart?`,
      productRefs: best.map((p) => p.id),
    };
  }

  // --- Dark chocolate ---
  if (/\b(dark\s*chocolate|dark\s*cocoa)\b/.test(text) && !findProduct(text)) {
    const dark = allProducts.filter((p) => /dark|coffee|salty|orange|mint/.test(p.flavor.toLowerCase())).slice(0, 3);
    return {
      text: `Yes, we have several dark chocolates! Our dark range goes from 70% to 85% cocoa:\n\n${dark.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nRich, intense, and full of cocoa goodness. Would you like me to add one?`,
      productRefs: dark.map((p) => p.id),
    };
  }

  // --- Prices ---
  if (/\b(price|cost|how\s*much|cheap|expensive|afford|budget|discount|bundle\s*offer|deal)\b/.test(text)) {
    if (/\b(discount|deal|bundle\s*offer|offer)\b/.test(text)) {
      return { text: "We have several ways to save:\n\n• Use code WELCOME10 for 10% off your first order\n• Orders over $50 ship for free\n• Seasonal promotions on our gift baskets\n\nWould you like me to help you build a basket to reach free shipping?" };
    }
    const product = findProduct(text);
    if (product) {
      return { text: `${product.name} costs $${product.price.toFixed(2)}. ${product.description} Would you like me to add it to your cart?`, productRefs: [product.id] };
    }
    const affordable = [...allProducts].sort((a, b) => a.price - b.price).slice(0, 3);
    const expensive = [...allProducts].sort((a, b) => b.price - a.price).slice(0, 1);
    return {
      text: `Our chocolates range from $${Math.min(...allProducts.map((p) => p.price)).toFixed(2)} to $${Math.max(...allProducts.map((p) => p.price)).toFixed(2)}.\n\nMost affordable:\n${affordable.map((p) => `• ${p.name} — $${p.price.toFixed(2)}`).join('\n')}\n\nMost premium:\n• ${expensive[0].name} — $${expensive[0].price.toFixed(2)}\n\nWould you like me to add one to your cart?`,
      productRefs: affordable.map((p) => p.id),
    };
  }

  // --- Specific product lookup ---
  const searchResults = searchProducts(text);
  if (searchResults.length > 0 && searchResults.length <= 5) {
    const product = findProduct(text);
    if (product) {
      const sf = product.collection === 'sugarfree' ? ' Yes, this is a sugar-free option!' : '';
      const similar = allProducts
        .filter((p) => p.id !== product.id && p.flavor.toLowerCase().includes(product.flavor.toLowerCase().split(' ')[0]))
        .slice(0, 2);
      let response = `${product.name} — ${formatProduct(product)}${sf}\n\nRating: ${product.rating}★ (${product.reviews} reviews)`;
      if (similar.length > 0) {
        response += `\n\nIf you like this, you might also enjoy:\n${similar.map((p) => `• ${p.name} — ${p.flavor}`).join('\n')}`;
      }
      response += '\n\nWould you like me to add it to your cart?';
      return {
        text: response,
        productRefs: [product.id, ...similar.map((p) => p.id)],
      };
    }
    return {
      text: `I found some chocolates that match! Here's what I've got:\n\n${searchResults.map((p) => `• ${formatProduct(p)}`).join('\n')}\n\nWould you like me to add any of these to your cart?`,
      productRefs: searchResults.map((p) => p.id),
    };
  }

  // --- Surprise me ---
  if (/\b(surprise|random|pick\s*for\s*me|choose\s*for\s*me)\b/.test(text)) {
    const random = allProducts[Math.floor(Math.random() * allProducts.length)];
    return {
      text: `Here's your surprise pick: ${random.name}! ${random.description} It's ${random.flavor} and costs $${random.price.toFixed(2)}. Want me to add it to your cart?`,
      productRefs: [random.id],
    };
  }

  // --- Fallback ---
  return {
    text: "I'd love to help with that! I'm Moggy AI, your chocolate assistant. You can ask me about our flavors, get gift recommendations, find sugar-free options, check ingredients or allergens, ask about delivery, or tell me to add a chocolate to your cart. What would you like to explore?",
  };
}

export { productNames };
