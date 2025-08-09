import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Popup, CircleMarker, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import localforage from "localforage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, LocateFixed, Filter, MapPin, FileDown, RotateCcw } from "lucide-react";

// ---- Types ----
/** @typedef {{
 *  id: string,
 *  name: string,
 *  food: string,
 *  description: string,
 *  tips: string,
 *  lat: number,
 *  lng: number,
 *  gmaps?: string,
 *  rating?: number | null,
 *  createdAt?: number
 * }} Place */

// ---- Storage Keys ----
const LS_PLACES = "sfj:places"; // primary data (seed + user-added)
const LS_RATINGS = "sfj:ratings"; // { [id]: number }
const LF_PHOTOS = "sfj:photos"; // localforage keyspace "sfj:photos::<id>" -> Blob[]
const LS_FILTERS = "sfj:filters"; // { foods: string[] }

localforage.config({
  name: "SingaporeFoodJourney",
  storeName: "sfj_store",
});

// ---- Embedded seed data (from your CSV) ----
const SEED_PLACES_RAW = 
[
  {
    "name": "Le Cheng",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Kampung half chicken",
    "lat": 1.318877588,
    "lng": 103.910394,
    "gmaps": "https://maps.app.goo.gl/iLcmbRY6ECU2x6ir8"
  },
  {
    "name": "Tian Tian",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Maxwell Food centre",
    "lat": 1.280441278,
    "lng": 103.8447981,
    "gmaps": "https://maps.app.goo.gl/X212S1g9xeutE7hp7"
  },
  {
    "name": "Sin Kee",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Exceptionally soft, clean taste. They use poached chicken, very good garlic chilli",
    "lat": 1.302403066,
    "lng": 103.8837138,
    "gmaps": "https://maps.app.goo.gl/Fs5StDgZ6rD6EJQg7"
  },
  {
    "name": "Yet Con",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Old school, classic",
    "lat": 1.295663363,
    "lng": 103.8537729,
    "gmaps": "https://maps.app.goo.gl/5mHiUJm1fZ6Y7d9P7"
  },
  {
    "name": "Pow Sing",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Crispy skin roast chicken",
    "lat": 1.350045936,
    "lng": 103.8702823,
    "gmaps": "https://maps.app.goo.gl/m3i5F1kYnD4c8Q6o7"
  },
  {
    "name": "Wee Nam Kee",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Novena flagship",
    "lat": 1.3199919,
    "lng": 103.8432522,
    "gmaps": "https://maps.app.goo.gl/7t9Cq6h9E8uM1iQn7"
  },
  {
    "name": "Loy Kee Best Chicken Rice",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Their signature platter",
    "lat": 1.327899,
    "lng": 103.8536626,
    "gmaps": "https://maps.app.goo.gl/3i4vJxVq2Kp1F7cA7"
  },
  {
    "name": "Five Star Kampung Chicken Rice",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Kampung chicken, less fatty",
    "lat": 1.3028073,
    "lng": 103.8832384,
    "gmaps": "https://maps.app.goo.gl/9wF7iQhR6Y6Ebxqg9"
  },
  {
    "name": "Ming Kee Chicken Rice",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Cold poached chicken, scallion oil",
    "lat": 1.3506971,
    "lng": 103.848936,
    "gmaps": "https://maps.app.goo.gl/Hm9w6Jz7yT2oPpVb8"
  },
  {
    "name": "Delicious Boneless Chicken Rice",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Mayflower, generous portions",
    "lat": 1.3727784,
    "lng": 103.8340756,
    "gmaps": "https://maps.app.goo.gl/rw1H5bqk2xk5t2oS9"
  },
  {
    "name": "Chin Chin Eating House",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Old school, also Hainanese pork chop",
    "lat": 1.301592104,
    "lng": 103.8565572,
    "gmaps": "https://maps.app.goo.gl/npGisJgYEk7iEF1PA"
  },
  {
    "name": "Chatterbox (Mandarin Gallery)",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "Upscale, pricey",
    "lat": 1.3019136,
    "lng": 103.8380001,
    "gmaps": "https://maps.app.goo.gl/3aVjVJzqTjV3bYQ38"
  },
  {
    "name": "Boon Tong Kee",
    "food": "Chicken rice",
    "description": "Hainanese chicken rice is a dish of poached ... served with chilli sauce and usually with cucumber garnishes.",
    "tips": "It’s a chain, so multiple",
    "lat": 1.325509156,
    "lng": 103.8495484,
    "gmaps": "https://maps.app.goo.gl/9xyC1mcbTRwR3VAu9"
  },
  {
    "name": "545 Whampoa Prawn Noodles",
    "food": "Prawn Noodles",
    "description": "Prawn noodles in a savoury broth or dry with chilli and lard.",
    "tips": "Long queue, breakfast",
    "lat": 1.320581507,
    "lng": 103.8530465,
    "gmaps": "https://maps.app.goo.gl/3HqKx9oCkq3qf8c26"
  },
  {
    "name": "Outram Park Ya Hua Rou Gu Cha",
    "food": "Bak Kut Teh",
    "description": "Peppery Teochew-style pork rib soup.",
    "tips": "Get you tiao",
    "lat": 1.2837181,
    "lng": 103.8346744,
    "gmaps": "https://maps.app.goo.gl/1b2YgJz5CCm8c3wG7"
  },
  {
    "name": "Song Fa Bak Kut Teh",
    "food": "Bak Kut Teh",
    "description": "Peppery Teochew-style pork rib soup.",
    "tips": "Clarke Quay outlet late",
    "lat": 1.2879164,
    "lng": 103.8460568,
    "gmaps": "https://maps.app.goo.gl/4QYqz9Q7jV5gY3mA8"
  },
  {
    "name": "Balestier Road Hoover Rojak",
    "food": "Rojak",
    "description": "Tangy-sweet salad with you tiao, fruits, veg.",
    "tips": "Sauce is thick, aromatic",
    "lat": 1.3272915,
    "lng": 103.8523738,
    "gmaps": "https://maps.app.goo.gl/k1t8N7hV6x6oU5pD9"
  },
  {
    "name": "Hill Street Tai Hwa Pork Noodle",
    "food": "Bak Chor Mee",
    "description": "Michelin-starred minced pork noodles.",
    "tips": "Vinegar-heavy, prepare",
    "lat": 1.3124678,
    "lng": 103.8613219,
    "gmaps": "https://maps.app.goo.gl/5g2tF6Y3LkH1oQkB8"
  },
  {
    "name": "A Noodle Story",
    "food": "Modern noods",
    "description": "Modern Singapore-style ramen.",
    "tips": "Michelin Bib Gourmand",
    "lat": 1.2798672,
    "lng": 103.8448152,
    "gmaps": "https://maps.app.goo.gl/7m8YkQz2g6FxQm4Q7"
  },
  {
    "name": "328 Katong Laksa",
    "food": "Laksa",
    "description": "Coconut curry noodle soup with cockles.",
    "tips": "Short noodles, spoon only",
    "lat": 1.3052197,
    "lng": 103.9032925,
    "gmaps": "https://maps.app.goo.gl/5gQX1rQwJ3zQ4yTt9"
  },
  {
    "name": "Sungei Road Laksa",
    "food": "Laksa",
    "description": "Charcoal-cooked broth, old-school flavour.",
    "tips": "Closes when sells out",
    "lat": 1.3092436,
    "lng": 103.8578112,
    "gmaps": "https://maps.app.goo.gl/2bT8oU9Hk7pKqJmH8"
  },
  {
    "name": "Original Katong Laksa (Roxy Square)",
    "food": "Laksa",
    "description": "Original Katong-style laksa.",
    "tips": "Rich broth",
    "lat": 1.3042138,
    "lng": 103.9057596,
    "gmaps": "https://maps.app.goo.gl/8zG2h1qM7nA8xQ2p6"
  },
  {
    "name": "Selera Rasa Nasi Lemak (Adam Road)",
    "food": "Nasi Lemak",
    "description": "Fragrant coconut rice with sambal, egg, fish.",
    "tips": "Sultan set popular",
    "lat": 1.3245932,
    "lng": 103.8141183,
    "gmaps": "https://maps.app.goo.gl/4oXzV6hFQ2q5kVjU7"
  },
  {
    "name": "Ponggol Nasi Lemak (Upper Serangoon)",
    "food": "Nasi Lemak",
    "description": "Crispy chicken wing, bright sambal.",
    "tips": "Supper crowd",
    "lat": 1.3629298,
    "lng": 103.8876376,
    "gmaps": "https://maps.app.goo.gl/2Y2r6k1JQ2bJq6c39"
  },
  {
    "name": "Crave Nasi Lemak (franchise)",
    "food": "Nasi Lemak",
    "description": "Chain with decent consistency.",
    "tips": "Airport branches",
    "lat": 1.356,
    "lng": 103.989,
    "gmaps": "https://maps.app.goo.gl/7Jp8bCq6tU8s9ZwB7"
  },
  {
    "name": "Jalan Sultan Prawn Mee",
    "food": "Prawn Mee",
    "description": "Rich prawn stock, pork ribs option.",
    "tips": "Go early, queue",
    "lat": 1.3107277,
    "lng": 103.8655281,
    "gmaps": "https://maps.app.goo.gl/8CSjXrUeH3W3mLwR6"
  },
  {
    "name": "Blanco Court Prawn Mee",
    "food": "Prawn Mee",
    "description": "Old-school prawn mee broth.",
    "tips": "Prawn/pork rib mix",
    "lat": 1.3069916,
    "lng": 103.8602439,
    "gmaps": "https://maps.app.goo.gl/5zH9Zc7n9wG6vV2r7"
  },
  {
    "name": "Da Dong Prawn Noodles",
    "food": "Prawn Mee",
    "description": "Dry version with punchy chilli.",
    "tips": "Add lard",
    "lat": 1.3147788,
    "lng": 103.8880714,
    "gmaps": "https://maps.app.goo.gl/4eY7nP6A6G3sV4xA9"
  },
  {
    "name": "Lao Liang Pig Organ Soup",
    "food": "Pig Organ Soup",
    "description": "Light savoury soup with offal.",
    "tips": "Stall at Bendemeer",
    "lat": 1.3124589,
    "lng": 103.8624413,
    "gmaps": "https://maps.app.goo.gl/3fH8wJ7xqT4nM5nF8"
  },
  {
    "name": "Xin Mei Xiang Zheng Zong Lor Mee",
    "food": "Lor Mee",
    "description": "Thick gravy noodles with fish and vinegar.",
    "tips": "Vinegar for balance",
    "lat": 1.3053742,
    "lng": 103.903284,
    "gmaps": "https://maps.app.goo.gl/6pG6qP4wS1sR8vB36"
  },
  {
    "name": "Old Airport Road Food Centre (various)",
    "food": "Many",
    "description": "Legendary hawker centre with many classics.",
    "tips": "Multiple stalls must-try",
    "lat": 1.3088696,
    "lng": 103.8850802,
    "gmaps": "https://maps.app.goo.gl/1M8VvP1E2QkM4cQF7"
  },
  {
    "name": "Tiong Bahru Market (various)",
    "food": "Many",
    "description": "Historic market, many great stalls.",
    "tips": "Go morning for kueh",
    "lat": 1.2859339,
    "lng": 103.832946,
    "gmaps": "https://maps.app.goo.gl/6mWmJ3s1wJ3vK3hF9"
  },
  {
    "name": "Maxwell Food Centre (various)",
    "food": "Many",
    "description": "Chinatown-area hawker centre, famous stalls.",
    "tips": "Tian Tian here",
    "lat": 1.2804031,
    "lng": 103.8447688,
    "gmaps": "https://maps.app.goo.gl/4nV2Kq6xQ9JwJb7D8"
  },
  {
    "name": "Amoy Street Food Centre (various)",
    "food": "Many",
    "description": "CBD hawker with lunch crowd, great options.",
    "tips": "A Noodle Story",
    "lat": 1.2798748,
    "lng": 103.8448409,
    "gmaps": "https://maps.app.goo.gl/8bE6hYvT8rW6pQ7A9"
  },
  {
    "name": "Lau Pa Sat (various)",
    "food": "Many",
    "description": "Satay street at night, lots of stalls.",
    "tips": "Touristy but fun",
    "lat": 1.2809485,
    "lng": 103.8507089,
    "gmaps": "https://maps.app.goo.gl/6Yx3k2YpW3r9vQ8D7"
  },
  {
    "name": "Zam Zam",
    "food": "Murtabak",
    "description": "Indian Muslim murtabak and biryani institution.",
    "tips": "Beef murtabak",
    "lat": 1.303199,
    "lng": 103.859896,
    "gmaps": "https://maps.app.goo.gl/7Nf2h6pM2gQ1tE9L7"
  },
  {
    "name": "Springleaf Prata Place",
    "food": "Prata",
    "description": "Creative pratas (eg, murtaburger), crispy.",
    "tips": "Multiple outlets",
    "lat": 1.4021193,
    "lng": 103.8189552,
    "gmaps": "https://maps.app.goo.gl/9E6yY5cL2eQ8zL6V7"
  },
  {
    "name": "Mr and Mrs Mohgan's Super Crispy Prata",
    "food": "Prata",
    "description": "Cult-fave crispy prata.",
    "tips": "Sold out early",
    "lat": 1.3128897,
    "lng": 103.8972353,
    "gmaps": "https://maps.app.goo.gl/6pQ8nZ4Jm5C3oV1Q7"
  },
  {
    "name": "Ya Kun Kaya Toast (various)",
    "food": "Kaya Toast",
    "description": "Classic kaya toast breakfast set.",
    "tips": "Chain, easy find",
    "lat": 1.3002,
    "lng": 103.8457,
    "gmaps": "https://maps.app.goo.gl/5R2JmZ1Kc3nBvV7T7"
  },
  {
    "name": "Toast Box (various)",
    "food": "Kaya Toast",
    "description": "Chain version of local breakfast.",
    "tips": "Widespread",
    "lat": 1.3003,
    "lng": 103.8459,
    "gmaps": "https://maps.app.goo.gl/7T5mW3cN2qB4xY7H8"
  },
  {
    "name": "Chye Seng Huat Hardware",
    "food": "Coffee",
    "description": "Hip coffee spot in hardware store space.",
    "tips": "Weekends busy",
    "lat": 1.3102134,
    "lng": 103.8624106,
    "gmaps": "https://maps.app.goo.gl/3Nw2tGxP7rH9mE1s8"
  },
  {
    "name": "% Arabica (Arab Street)",
    "food": "Coffee",
    "description": "Stylish chain coffee.",
    "tips": "Touristy area",
    "lat": 1.3018278,
    "lng": 103.8599117,
    "gmaps": "https://maps.app.goo.gl/1S8xV5mM9kD5rQ7W6"
  },
  {
    "name": "Micro Bakery (East Coast)",
    "food": "Bakery",
    "description": "Sourdough loaves and brunch.",
    "tips": "East Coast outlet",
    "lat": 1.3062059,
    "lng": 103.914395,
    "gmaps": "https://maps.app.goo.gl/9S3eN8mQ3xT1mE7R8"
  },
  {
    "name": "Brawn & Brains Coffee",
    "food": "Coffee",
    "description": "Local roastery and cafe.",
    "tips": "Omelette popular",
    "lat": 1.3038026,
    "lng": 103.885476,
    "gmaps": "https://maps.app.goo.gl/3f7qH1JtN2gQ6yU8A"
  },
  {
    "name": "Beng Hiang Restaurant",
    "food": "Hokkien",
    "description": "Old-school Hokkien classics.",
    "tips": "Five spice roll",
    "lat": 1.2833172,
    "lng": 103.8513911,
    "gmaps": "https://maps.app.goo.gl/9R2uL3rQ6mK8tP5A7"
  },
  {
    "name": "Hjh Maimunah",
    "food": "Malay / Nasi Padang",
    "description": "Beloved nasi padang spread.",
    "tips": "Tauhu telor",
    "lat": 1.3056136,
    "lng": 103.8581961,
    "gmaps": "https://maps.app.goo.gl/4pU9nV6wK2mD7hS8B"
  },
  {
    "name": "Swee Choon Tim Sum Restaurant",
    "food": "Dim sum",
    "description": "Late-night dim sum institution.",
    "tips": "Go off-peak",
    "lat": 1.3105324,
    "lng": 103.8562005,
    "gmaps": "https://maps.app.goo.gl/7Xn9YcP3rS2mH8C4A"
  },
  {
    "name": "Burnt Ends",
    "food": "Modern BBQ",
    "description": "Wood-fired modern barbecue.",
    "tips": "Reservations tough",
    "lat": 1.2784901,
    "lng": 103.8448938,
    "gmaps": "https://maps.app.goo.gl/6FQmR2nS7pS4kT9C7"
  },
  {
    "name": "Candlenut",
    "food": "Peranakan (Michelin)",
    "description": "Refined Peranakan cuisine.",
    "tips": "Dempsey Hill",
    "lat": 1.3040835,
    "lng": 103.8126278,
    "gmaps": "https://maps.app.goo.gl/2G8wYj6wR5sP6mT4V"
  },
  {
    "name": "JB Ah Meng",
    "food": "Zi char",
    "description": "Late-night zi char, white pepper crab.",
    "tips": "Messy but great",
    "lat": 1.3099387,
    "lng": 103.8579704,
    "gmaps": "https://maps.app.goo.gl/9S1qU3mN6rB5pT4Q8"
  },
  {
    "name": "New Ubin Seafood",
    "food": "Zi char",
    "description": "Wagyu with heart attack fried rice.",
    "tips": "Many outlets",
    "lat": 1.3207997,
    "lng": 103.8424838,
    "gmaps": "https://maps.app.goo.gl/7C9tD1fQ3rH8yK5M7"
  },
  {
    "name": "Hawker Chan (Liao Fan)",
    "food": "Soy Sauce Chicken Rice",
    "description": "Formerly Michelin-starred hawker.",
    "tips": "Expect queue",
    "lat": 1.2796362,
    "lng": 103.8438367,
    "gmaps": "https://maps.app.goo.gl/3tX8kQ6jZ7sQ1mN5C"
  },
  {
    "name": "Bee Kee Wanton Noodles",
    "food": "Wanton Mee",
    "description": "Truffle wanton mee version.",
    "tips": "Truffle aroma heavy",
    "lat": 1.313257,
    "lng": 103.856004,
    "gmaps": "https://maps.app.goo.gl/6R2pW4nC7qM9sL2H8"
  },
  {
    "name": "Eng's Wantan Mee",
    "food": "Wanton Mee",
    "description": "Fiery chilli, springy noodles.",
    "tips": "Careful with chilli",
    "lat": 1.3152993,
    "lng": 103.8865813,
    "gmaps": "https://maps.app.goo.gl/1U6kP5qL9xY2nB4C7"
  },
  {
    "name": "Fei Fei Wanton Mee",
    "food": "Wanton Mee",
    "description": "Old-school wanton mee.",
    "tips": "Late night option",
    "lat": 1.3133413,
    "lng": 103.9013534,
    "gmaps": "https://maps.app.goo.gl/4V7mN3pK5qL2yS8D9"
  },
  {
    "name": "Sungei Road Trishaw Laksa",
    "food": "Laksa",
    "description": "A different laksa stall (not same as Sungei Road Laksa).",
    "tips": "Try crayfish version",
    "lat": 1.282998,
    "lng": 103.844213,
    "gmaps": "https://maps.app.goo.gl/H5o8ZCzFQkKkHZ3f9"
  },
  {
    "name": "Tanglin Halt Original Peanut Pancake",
    "food": "Min Jiang Kueh",
    "description": "Thick peanut pancake mornings.",
    "tips": "Sold out fast",
    "lat": 1.302361,
    "lng": 103.798634,
    "gmaps": "https://maps.app.goo.gl/7t6u4KxK9Wu4a6mX8"
  },
  {
    "name": "RedRing Treasures",
    "food": "Chicken Cutlet Noodles",
    "description": "Crispy chicken cutlet with noodles.",
    "tips": "Clementi outlet",
    "lat": 1.314669,
    "lng": 103.765469,
    "gmaps": "https://maps.app.goo.gl/3gW7d4e1c2oUy1v37"
  },
  {
    "name": "Ah Tai Hainanese Chicken Rice",
    "food": "Chicken rice",
    "description": "Rival stall to Tian Tian at Maxwell.",
    "tips": "Shorter queue sometimes",
    "lat": 1.280359,
    "lng": 103.844776,
    "gmaps": "https://maps.app.goo.gl/6d1s9m5pVQ1e7jZr9"
  },
  {
    "name": "Yakun Family Cafe",
    "food": "Kaya Toast",
    "description": "Variant of Ya Kun with larger menu.",
    "tips": "More seating",
    "lat": 1.331418,
    "lng": 103.849657,
    "gmaps": "https://maps.app.goo.gl/2p9oQm2xN2Jk8VfC9"
  },
  {
    "name": "Ah Chew Desserts",
    "food": "Chinese Desserts",
    "description": "Hot and cold Chinese desserts.",
    "tips": "Herbal jelly, mango sago",
    "lat": 1.300548,
    "lng": 103.847155,
    "gmaps": "https://maps.app.goo.gl/6o9mU3gPq1mH7yK28"
  },
  {
    "name": "1950’s Coffee",
    "food": "Coffee",
    "description": "Retro kopitiam coffee vibe.",
    "tips": "Butter kopi option",
    "lat": 1.311162,
    "lng": 103.86022,
    "gmaps": "https://maps.app.goo.gl/1h2Jk5Lq8mN4pW6C7"
  }
]

function slugify(x) {
  return (x || "").toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function idFromPlace(p) {
  return p.id || `${slugify(p.name)}_${p.lat?.toFixed(5)}_${p.lng?.toFixed(5)}`;
}

function colorForRating(r) {
  if (r == null) return "#808080";
  if (r <= 5) return "#ef4444";
  if (r <= 7) return "#f59e0b";
  return "#22c55e";
}

async function loadPhotos(placeId) {
  const key = `${LF_PHOTOS}::${placeId}`;
  const arr = (await localforage.getItem(key)) || [];
  return /** @type {Blob[]} */(arr);
}

async function savePhotos(placeId, blobs) {
  const key = `${LF_PHOTOS}::${placeId}`;
  await localforage.setItem(key, blobs);
}

function useUserLocation() {
  const [pos, setPos] = useState(null);
  const [acc, setAcc] = useState(null);
  const [error, setError] = useState(null);
  const watchId = useRef(null);
  useEffect(() => {
    if (!("geolocation" in navigator)) { setError("Geolocation not supported"); return; }
    watchId.current = navigator.geolocation.watchPosition(
      (p) => { setPos([p.coords.latitude, p.coords.longitude]); setAcc(p.coords.accuracy || null); },
      (e) => setError(e.message || "Geolocation error"),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );
    return () => { if (watchId.current) navigator.geolocation.clearWatch(watchId.current); };
  }, []);
  return { pos, acc, error };
}

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}

function ClickCapture({ onClick }) {
  useMapEvents({ click(e) { onClick && onClick(e.latlng); } });
  return null;
}

function applyRatingsToPlaces(list, ratings) {
  let changed = false;
  const next = list.map((p) => {
    const id = idFromPlace(p);
    const r = ratings[id] ?? null;
    const same = (p.rating ?? null) === (r ?? null);
    if (!same) { changed = true; return { ...p, rating: r }; }
    return p;
  });
  return { next, changed };
}

// ---- Dev tests (console assertions) ----
function DevTests(){
  useEffect(()=>{
    console.assert(colorForRating(null) === "#808080", "Unrated should be grey");
    console.assert(colorForRating(1) === "#ef4444", "1–5 should be red");
    console.assert(colorForRating(5) === "#ef4444", "<=5 should be red");
    console.assert(colorForRating(6) === "#f59e0b", "6–7 should be yellow");
    console.assert(colorForRating(7) === "#f59e0b", "6–7 should be yellow (upper bound)");
    console.assert(colorForRating(8) === "#22c55e", "8–10 should be green");
    const id = idFromPlace({ name: "Test", lat: 1.234567, lng: 103.987654 });
    console.assert(id.includes("test_1.23457_103.98765"), "idFromPlace must include rounded coords");
    const sample = [{ id: "a_1_2", name: "A", food: "x", description: "", tips: "", lat:1, lng:2, rating: 6 }];
    const { next, changed } = applyRatingsToPlaces(sample, { a_1_2: 6 });
    console.assert(changed === false, "No change if rating same");
    console.assert(next[0] === sample[0], "Same object preserved when rating unchanged");

    // Additional tests: seed data sanity
    console.assert(Array.isArray(SEED_PLACES_RAW) && SEED_PLACES_RAW.length > 0, "Seed data should be non-empty array");
    const bad = SEED_PLACES_RAW.find(p => !(p.name && Number.isFinite(p.lat) && Number.isFinite(p.lng)));
    console.assert(!bad, "Every seed place must have name and valid lat/lng");
    const hasNewlineInTips = SEED_PLACES_RAW.some(p => typeof p.tips === 'string' && p.tips.includes("\n"));
    console.assert(!hasNewlineInTips, "No seed tips should contain newline characters");
    const ids = new Set(SEED_PLACES_RAW.map(p => `${p.name}_${p.lat}_${p.lng}`));
    console.assert(ids.size === SEED_PLACES_RAW.length, "Seed IDs should be unique by name+coords");
  }, []);
  return null;
}

// ---- Main App ----
const singaporeCenter = [1.3521, 103.8198];

export default function App() {
  // Initialize from embedded seed only if user has nothing saved yet
  const [places, setPlaces] = useLocalStorage(LS_PLACES, /** @type {Place[]} */(SEED_PLACES_RAW.map(p=>({
    id: `${slugify(p.name)}_${p.lat}_${p.lng}`,
    name: p.name,
    food: p.food,
    description: p.description||"",
    tips: p.tips||"",
    lat: p.lat,
    lng: p.lng,
    gmaps: p.gmaps||"",
    rating: null,
    createdAt: Date.now(),
  }))));
  const [ratings, setRatings] = useLocalStorage(LS_RATINGS, /** @type {Record<string, number>} */({}));
  const [filters, setFilters] = useLocalStorage(LS_FILTERS, { foods: [] });
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addCoords, setAddCoords] = useState(null);
  const [previewPhotos, setPreviewPhotos] = useState({});
  const mapRef = useRef(null);

  const { pos: userPos, acc: userAcc } = useUserLocation();

  useEffect(() => {
    setPlaces((prev) => {
      const { next, changed } = applyRatingsToPlaces(prev, ratings);
      return changed ? next : prev;
    });
  }, [ratings, places]);

  const foodsList = useMemo(() => {
    const s = new Set(places.map(p => (p.food || "").trim()).filter(Boolean));
    return Array.from(s).sort((a,b)=>a.localeCompare(b));
  }, [places]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return places.filter(p => {
      if (filters.foods.length && !filters.foods.includes(p.food)) return false;
      if (!q) return true;
      return [p.name, p.food, p.description, p.tips].some(v => (v||"").toLowerCase().includes(q));
    });
  }, [places, filters, search]);

  const center = userPos || singaporeCenter;

  function handleRating(placeId, value) {
    const num = value ? parseInt(value, 10) : null;
    setRatings(prev => ({ ...prev, [placeId]: num }));
  }

  async function handlePhotoUpload(placeId, files) {
    if (!files || !files.length) return;
    const existing = await loadPhotos(placeId);
    const blobs = [...existing];
    for (const f of files) blobs.push(f);
    await savePhotos(placeId, blobs);
    const urls = await Promise.all(blobs.map(b => blobToDataURL(b)));
    setPreviewPhotos(prev => ({ ...prev, [placeId]: urls }));
  }

  async function loadPreviews(placeId) {
    const blobs = await loadPhotos(placeId);
    const urls = await Promise.all(blobs.map(b => blobToDataURL(b)));
    setPreviewPhotos(prev => ({ ...prev, [placeId]: urls }));
  }

  function blobToDataURL(blob) {
    return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob); });
  }

  function clearAll() {
    if (!confirm("Clear all locally saved data? This only affects your browser.")) return;
    localStorage.removeItem(LS_PLACES);
    localStorage.removeItem(LS_RATINGS);
    localStorage.removeItem(LS_FILTERS);
    Promise.all(places.map(p => localforage.removeItem(`${LF_PHOTOS}::${idFromPlace(p)}`))).then(()=>{
      location.reload();
    });
  }

  function exportBackup() {
    const payload = { places, ratings, filters };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `sfj-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  }

  function importBackup(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        if (obj.places) setPlaces(obj.places);
        if (obj.ratings) setRatings(obj.ratings);
        if (obj.filters) setFilters(obj.filters);
        alert("Backup imported.");
      } catch (e) { alert("Invalid backup file"); }
    };
    reader.readAsText(file);
  }

  function onMapAddClick(latlng) {
    setAddCoords(latlng);
    setAddOpen(true);
  }

  function addNewPlace(fields) {
    const p = /** @type {Place} */({
      id: `${slugify(fields.name)}_${fields.lat.toFixed(5)}_${fields.lng.toFixed(5)}`,
      name: fields.name,
      food: fields.food,
      description: fields.description || "",
      tips: fields.tips || "",
      lat: fields.lat,
      lng: fields.lng,
      gmaps: fields.gmaps || "",
      rating: null,
      createdAt: Date.now(),
    });
    setPlaces(prev => [p, ...prev]);
    setAddOpen(false);
    setAddCoords(null);
  }

  return (
    <div className="h-screen w-full grid grid-rows-[auto_1fr]">
      <header className="p-3 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-[500]">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          <h1 className="font-semibold text-lg">Singapore Food Journey</h1>
          <div className="ml-auto flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm"><Filter className="h-4 w-4 mr-1"/>Filter</Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[340px] sm:w-[420px]">
                <SheetHeader>
                  <SheetTitle>Search & Filter</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <Input placeholder="Search by name, food, notes…" value={search} onChange={(e)=>setSearch(e.target.value)} />
                  <Accordion type="single" collapsible>
                    <AccordionItem value="food">
                      <AccordionTrigger>Filter by food</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                          {foodsList.length === 0 ? <p className="text-sm text-muted-foreground">No food tags yet</p> : null}
                          {foodsList.map(food => (
                            <Badge key={food} variant={filters.foods.includes(food) ? "default" : "secondary"}
                              className="cursor-pointer"
                              onClick={() => setFilters(prev => ({
                                ...prev,
                                foods: prev.foods.includes(food) ? prev.foods.filter(f=>f!==food) : [...prev.foods, food]
                              }))}
                            >{food}</Badge>
                          ))}
                        </div>
                        {filters.foods.length > 0 && (
                          <Button variant="ghost" size="sm" className="mt-3" onClick={()=>setFilters(prev=>({...prev, foods: []}))}>Clear food filters</Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline"><FileDown className="h-4 w-4 mr-1"/>Import Backup</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Import Backup</DialogTitle></DialogHeader>
                        <Input type="file" accept="application/json" onChange={(e)=>importBackup(e.target.files?.[0])} />
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline" onClick={exportBackup}><FileDown className="h-4 w-4 mr-1"/>Export Backup</Button>
                    <Button size="sm" variant="destructive" onClick={clearAll}><RotateCcw className="h-4 w-4 mr-1"/>Reset</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1"/>Add Place</Button>
              </DialogTrigger>
              <AddPlaceDialogContent
                coords={addCoords}
                onSubmit={addNewPlace}
              />
            </Dialog>

            <Button variant="outline" size="sm" onClick={()=>{
              if (!userPos) return alert("Trying to find you… Move a bit if GPS is blocked.");
              try { mapRef.current?.flyTo(userPos, 15, { animate: true }); } catch {}
            }}><LocateFixed className="h-4 w-4 mr-1"/>My Location</Button>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="absolute z-[400] left-2 top-2 bg-white/90 rounded-2xl shadow p-2">
          <Legend />
        </div>
        <MapContainer whenCreated={(map)=>{ mapRef.current = map; }} center={center} zoom={12} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCapture onClick={onMapAddClick} />
          {filtered.map((p) => (
            <PlaceMarker key={idFromPlace(p)} place={p} onRate={handleRating} onPhoto={handlePhotoUpload} onOpenPhotos={loadPreviews} previews={previewPhotos[idFromPlace(p)]} />
          ))}

          {userPos && (
            <>
              <CircleMarker center={userPos} radius={8} pathOptions={{ color: "#3b82f6" }} />
              {userAcc && <Circle center={userPos} radius={userAcc} pathOptions={{ color: "#60a5fa", weight:1, dashArray: "4 6"}}/>}
            </>
          )}
        </MapContainer>
        <DevTests />
      </main>
    </div>
  );
}

function Legend(){
  const items = [
    { c: "#22c55e", t: "8–10 (green)" },
    { c: "#f59e0b", t: "6–7 (yellow)" },
    { c: "#ef4444", t: "1–5 (red)" },
    { c: "#808080", t: "Unrated" },
  ];
  return (
    <div className="text-xs">
      <div className="font-medium mb-1">Ratings</div>
      <div className="flex flex-col gap-1">
        {items.map((it)=> (
          <div key={it.t} className="flex items-center gap-2">
            <span className="inline-block rounded-full" style={{ width: 12, height: 12, background: it.c }} />
            <span>{it.t}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground">Click map to start adding places</div>
    </div>
  )
}

function PlaceMarker({ place, onRate, onPhoto, onOpenPhotos, previews }){
  const id = idFromPlace(place);
  const color = colorForRating(place.rating);
  const [open, setOpen] = useState(false);

  useEffect(()=>{ if (open) onOpenPhotos?.(id); }, [open, id, onOpenPhotos]);

  return (
    <CircleMarker center={[place.lat, place.lng]} radius={10} pathOptions={{ color, fillColor: color, fillOpacity: 0.8 }} eventHandlers={{ click: ()=>setOpen(true) }}>
      {open && (
        <Popup onClose={()=>setOpen(false)}>
          <div className="min-w-[260px] space-y-2">
            <div>
              <div className="font-semibold text-base leading-tight">{place.name}</div>
              <div className="text-xs text-muted-foreground">{place.food}</div>
            </div>
            {place.description && <p className="text-sm">{place.description}</p>}
            {place.tips && <p className="text-xs bg-muted p-2 rounded-md">💡 {place.tips}</p>}
            {place.gmaps && (
              <a className="text-sm underline" href={place.gmaps} target="_blank" rel="noreferrer">Open in Google Maps</a>
            )}
            <div className="pt-1">
              <label className="text-xs block mb-1">Rate (1–10)</label>
              <Select value={place.rating?.toString() || ""} onValueChange={(v)=>onRate?.(id, v)}>
                <SelectTrigger className="h-8"><SelectValue placeholder="Select"/></SelectTrigger>
                <SelectContent>
                  {Array.from({length:10}, (_,i)=>i+1).map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="pt-1">
              <label className="text-xs block mb-1">Add photo(s)</label>
              <Input type="file" accept="image/*" multiple onChange={(e)=>onPhoto?.(id, e.target.files)} />
              <div className="flex gap-2 flex-wrap mt-2">
                {(previews||[]).map((src, idx)=>(
                  <img key={idx} src={src} className="h-16 w-16 object-cover rounded-md border"/>
                ))}
              </div>
            </div>
          </div>
        </Popup>
      )}
    </CircleMarker>
  );
}

function AddPlaceDialogContent({ coords, onSubmit }){
  const [name, setName] = useState("");
  const [food, setFood] = useState("");
  const [description, setDescription] = useState("");
  const [tips, setTips] = useState("");
  const [gmaps, setGmaps] = useState("");
  const [lat, setLat] = useState(coords?.lat ?? singaporeCenter[0]);
  const [lng, setLng] = useState(coords?.lng ?? singaporeCenter[1]);

  useEffect(()=>{
    if (coords) { setLat(coords.lat); setLng(coords.lng); }
  }, [coords]);

  return (
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Add a new place</DialogTitle>
      </DialogHeader>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs">Name</label>
            <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., Tiong Bahru Hainanese Chicken" />
          </div>
          <div className="col-span-2">
            <label className="text-xs">Food</label>
            <Input value={food} onChange={(e)=>setFood(e.target.value)} placeholder="e.g., Chicken Rice" />
          </div>
          <div className="col-span-2">
            <label className="text-xs">Description</label>
            <Textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Short notes…" />
          </div>
          <div className="col-span-2">
            <label className="text-xs">Tips</label>
            <Textarea value={tips} onChange={(e)=>setTips(e.target.value)} placeholder="Best time to go, what to order…" />
          </div>
          <div>
            <label className="text-xs">Latitude</label>
            <Input type="number" step="0.00001" value={lat} onChange={(e)=>setLat(parseFloat(e.target.value))} />
          </div>
          <div>
            <label className="text-xs">Longitude</label>
            <Input type="number" step="0.00001" value={lng} onChange={(e)=>setLng(parseFloat(e.target.value))} />
          </div>
          <div className="col-span-2">
            <label className="text-xs">Google Maps Link (optional)</label>
            <Input value={gmaps} onChange={(e)=>setGmaps(e.target.value)} placeholder="https://maps.google.com/?q=…" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={()=>{
            setName(""); setFood(""); setDescription(""); setTips(""); setGmaps("");
          }}>Clear</Button>
          <Button onClick={()=>{
            if (!name || !food || !Number.isFinite(lat) || !Number.isFinite(lng)) { alert("Please fill name, food, and valid coordinates."); return; }
            onSubmit({ name, food, description, tips, lat, lng, gmaps });
          }}>Add</Button>
        </div>
        <p className="text-xs text-muted-foreground">Tip: you can click on the map first to auto-fill coordinates.</p>
      </div>
    </DialogContent>
  );
}
