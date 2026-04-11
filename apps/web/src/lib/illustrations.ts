/**
 * Illustration Library — original, flat-style SVG illustrations.
 *
 * These are hand-crafted, original SVGs bundled with Monet.
 * No external dependencies, no license restrictions — these are
 * part of the Monet project (AGPLv3).
 *
 * Each illustration is a 400×300 SVG with a flat/geometric style,
 * designed to be useful in social media posts, presentations, and
 * marketing materials.
 *
 * Illustrations insert as editable Fabric.js groups — users can
 * ungroup and modify individual shapes/colors.
 *
 * Categories: Abstract, Business, Technology, Social, Nature
 */

export interface Illustration {
  id: string;
  name: string;
  category: string;
  tags: string;
  svg: string;
}

const ILLUSTRATIONS: Illustration[] = [
  // ─── Abstract & Decorative ─────────────────────────────────────
  {
    id: 'abstract-waves',
    name: 'Abstract Waves',
    category: 'Abstract',
    tags: 'abstract waves flow gradient decorative background',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#F0F4FF"/>
      <path d="M0 200 Q100 150 200 180 Q300 210 400 160 L400 300 L0 300Z" fill="#818CF8" opacity="0.3"/>
      <path d="M0 220 Q100 180 200 210 Q300 240 400 190 L400 300 L0 300Z" fill="#6366F1" opacity="0.4"/>
      <path d="M0 250 Q100 210 200 240 Q300 270 400 230 L400 300 L0 300Z" fill="#4F46E5" opacity="0.6"/>
      <circle cx="320" cy="60" r="40" fill="#FCD34D" opacity="0.8"/>
      <circle cx="320" cy="60" r="25" fill="#FBBF24"/>
    </svg>`,
  },
  {
    id: 'geometric-shapes',
    name: 'Geometric Composition',
    category: 'Abstract',
    tags: 'geometric shapes abstract circles triangles modern',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#FEFCE8"/>
      <circle cx="120" cy="140" r="80" fill="#F97316" opacity="0.7"/>
      <circle cx="200" cy="160" r="60" fill="#EC4899" opacity="0.5"/>
      <rect x="240" y="80" width="100" height="100" rx="12" fill="#C4704A" opacity="0.6" transform="rotate(15 290 130)"/>
      <polygon points="60,250 120,170 180,250" fill="#10B981" opacity="0.6"/>
      <circle cx="330" cy="230" r="45" fill="#06B6D4" opacity="0.5"/>
      <line x1="20" y1="40" x2="160" y2="40" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
      <line x1="20" y1="55" x2="100" y2="55" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'blob-pattern',
    name: 'Organic Blobs',
    category: 'Abstract',
    tags: 'blob organic soft gradient pattern decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#FDF2F8"/>
      <ellipse cx="100" cy="100" rx="90" ry="70" fill="#F9A8D4" opacity="0.6" transform="rotate(-20 100 100)"/>
      <ellipse cx="300" cy="80" rx="70" ry="55" fill="#e8c4a8" opacity="0.5" transform="rotate(25 300 80)"/>
      <ellipse cx="200" cy="200" rx="110" ry="80" fill="#93C5FD" opacity="0.4" transform="rotate(-10 200 200)"/>
      <ellipse cx="340" cy="230" rx="60" ry="50" fill="#6EE7B7" opacity="0.5" transform="rotate(15 340 230)"/>
      <ellipse cx="60" cy="240" rx="50" ry="40" fill="#FDE68A" opacity="0.6" transform="rotate(-25 60 240)"/>
    </svg>`,
  },
  {
    id: 'gradient-grid',
    name: 'Gradient Grid',
    category: 'Abstract',
    tags: 'grid gradient squares pattern modern minimal',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#F8FAFC"/>
      <rect x="30" y="30" width="60" height="60" rx="8" fill="#EF4444" opacity="0.8"/>
      <rect x="100" y="30" width="60" height="60" rx="8" fill="#F97316" opacity="0.7"/>
      <rect x="170" y="30" width="60" height="60" rx="8" fill="#EAB308" opacity="0.6"/>
      <rect x="240" y="30" width="60" height="60" rx="8" fill="#22C55E" opacity="0.5"/>
      <rect x="310" y="30" width="60" height="60" rx="8" fill="#3B82F6" opacity="0.4"/>
      <rect x="30" y="100" width="60" height="60" rx="8" fill="#F97316" opacity="0.6"/>
      <rect x="100" y="100" width="60" height="60" rx="8" fill="#EAB308" opacity="0.8"/>
      <rect x="170" y="100" width="60" height="60" rx="8" fill="#22C55E" opacity="0.7"/>
      <rect x="240" y="100" width="60" height="60" rx="8" fill="#3B82F6" opacity="0.6"/>
      <rect x="310" y="100" width="60" height="60" rx="8" fill="#C4704A" opacity="0.8"/>
      <rect x="30" y="170" width="60" height="60" rx="8" fill="#EAB308" opacity="0.5"/>
      <rect x="100" y="170" width="60" height="60" rx="8" fill="#22C55E" opacity="0.6"/>
      <rect x="170" y="170" width="60" height="60" rx="8" fill="#3B82F6" opacity="0.8"/>
      <rect x="240" y="170" width="60" height="60" rx="8" fill="#C4704A" opacity="0.7"/>
      <rect x="310" y="170" width="60" height="60" rx="8" fill="#EC4899" opacity="0.6"/>
    </svg>`,
  },

  // ─── Business & Work ───────────────────────────────────────────
  {
    id: 'bar-chart',
    name: 'Growth Chart',
    category: 'Business',
    tags: 'chart bar graph growth analytics data business stats',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#F0FDF4"/>
      <line x1="60" y1="40" x2="60" y2="250" stroke="#D1D5DB" stroke-width="2"/>
      <line x1="60" y1="250" x2="360" y2="250" stroke="#D1D5DB" stroke-width="2"/>
      <rect x="90" y="180" width="40" height="70" rx="4" fill="#86EFAC"/>
      <rect x="145" y="140" width="40" height="110" rx="4" fill="#4ADE80"/>
      <rect x="200" y="160" width="40" height="90" rx="4" fill="#22C55E"/>
      <rect x="255" y="100" width="40" height="150" rx="4" fill="#16A34A"/>
      <rect x="310" y="60" width="40" height="190" rx="4" fill="#15803D"/>
      <path d="M110 170 L165 130 L220 150 L275 90 L330 50" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="110" cy="170" r="5" fill="#059669"/>
      <circle cx="165" cy="130" r="5" fill="#059669"/>
      <circle cx="220" cy="150" r="5" fill="#059669"/>
      <circle cx="275" cy="90" r="5" fill="#059669"/>
      <circle cx="330" cy="50" r="5" fill="#059669"/>
    </svg>`,
  },
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    category: 'Business',
    tags: 'chart pie analytics data business statistics percentage',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#FFF7ED"/>
      <circle cx="180" cy="150" r="100" fill="#FDBA74"/>
      <path d="M180 150 L180 50 A100 100 0 0 1 280 150Z" fill="#F97316"/>
      <path d="M180 150 L280 150 A100 100 0 0 1 230 237Z" fill="#EA580C"/>
      <path d="M180 150 L230 237 A100 100 0 0 1 130 237Z" fill="#FB923C"/>
      <rect x="300" y="80" width="14" height="14" rx="3" fill="#F97316"/>
      <rect x="300" y="110" width="14" height="14" rx="3" fill="#EA580C"/>
      <rect x="300" y="140" width="14" height="14" rx="3" fill="#FB923C"/>
      <rect x="300" y="170" width="14" height="14" rx="3" fill="#FDBA74"/>
      <line x1="320" y1="87" x2="370" y2="87" stroke="#9CA3AF" stroke-width="8" stroke-linecap="round"/>
      <line x1="320" y1="117" x2="355" y2="117" stroke="#9CA3AF" stroke-width="8" stroke-linecap="round"/>
      <line x1="320" y1="147" x2="360" y2="147" stroke="#9CA3AF" stroke-width="8" stroke-linecap="round"/>
      <line x1="320" y1="177" x2="345" y2="177" stroke="#9CA3AF" stroke-width="8" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'target-goal',
    name: 'Target Goal',
    category: 'Business',
    tags: 'target goal bullseye aim success achievement focus',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#FEF2F2"/>
      <circle cx="200" cy="150" r="110" fill="#FECACA"/>
      <circle cx="200" cy="150" r="80" fill="#FCA5A5"/>
      <circle cx="200" cy="150" r="50" fill="#F87171"/>
      <circle cx="200" cy="150" r="20" fill="#EF4444"/>
      <line x1="200" y1="30" x2="200" y2="270" stroke="#DC2626" stroke-width="1.5" opacity="0.3"/>
      <line x1="80" y1="150" x2="320" y2="150" stroke="#DC2626" stroke-width="1.5" opacity="0.3"/>
      <path d="M290 60 L205 145" stroke="#1E40AF" stroke-width="3" stroke-linecap="round"/>
      <polygon points="200,140 195,155 210,150" fill="#1E40AF"/>
      <path d="M290 60 L310 50 L300 70Z" fill="#1E40AF"/>
    </svg>`,
  },

  // ─── Technology ────────────────────────────────────────────────
  {
    id: 'laptop-code',
    name: 'Laptop Coding',
    category: 'Technology',
    tags: 'laptop code programming developer tech computer screen',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#EFF6FF"/>
      <rect x="80" y="50" width="240" height="160" rx="12" fill="#1E293B"/>
      <rect x="92" y="62" width="216" height="136" rx="4" fill="#0F172A"/>
      <line x1="110" y1="85" x2="170" y2="85" stroke="#818CF8" stroke-width="3" stroke-linecap="round"/>
      <line x1="120" y1="105" x2="210" y2="105" stroke="#34D399" stroke-width="3" stroke-linecap="round"/>
      <line x1="120" y1="125" x2="185" y2="125" stroke="#FBBF24" stroke-width="3" stroke-linecap="round"/>
      <line x1="130" y1="145" x2="240" y2="145" stroke="#F472B6" stroke-width="3" stroke-linecap="round"/>
      <line x1="130" y1="165" x2="200" y2="165" stroke="#34D399" stroke-width="3" stroke-linecap="round"/>
      <line x1="110" y1="185" x2="150" y2="185" stroke="#818CF8" stroke-width="3" stroke-linecap="round"/>
      <path d="M50 215 L80 210 L320 210 L350 215 L360 225 L40 225Z" fill="#334155"/>
      <rect x="170" y="218" width="60" height="4" rx="2" fill="#64748B"/>
    </svg>`,
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    category: 'Technology',
    tags: 'mobile phone app smartphone device screen ui',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#fdf6f0"/>
      <rect x="140" y="20" width="120" height="260" rx="20" fill="#1E293B"/>
      <rect x="148" y="45" width="104" height="210" rx="4" fill="#E2E8F0"/>
      <rect x="180" y="28" width="40" height="6" rx="3" fill="#475569"/>
      <rect x="158" y="55" width="84" height="30" rx="6" fill="#C4704A"/>
      <rect x="158" y="95" width="40" height="40" rx="8" fill="#e8c4a8"/>
      <rect x="202" y="95" width="40" height="40" rx="8" fill="#f0dcc8"/>
      <rect x="158" y="145" width="84" height="12" rx="4" fill="#E5E7EB"/>
      <rect x="158" y="165" width="84" height="12" rx="4" fill="#E5E7EB"/>
      <rect x="158" y="185" width="60" height="12" rx="4" fill="#E5E7EB"/>
      <rect x="158" y="210" width="84" height="30" rx="15" fill="#a85a3a"/>
      <circle cx="200" cy="268" r="8" stroke="#475569" stroke-width="2" fill="none"/>
    </svg>`,
  },
  {
    id: 'cloud-storage',
    name: 'Cloud Storage',
    category: 'Technology',
    tags: 'cloud storage upload data server hosting backup',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#F0F9FF"/>
      <path d="M280 160 A60 60 0 0 0 220 100 A80 80 0 0 0 140 140 A50 50 0 0 0 100 190 L300 190 A40 40 0 0 0 280 160Z" fill="#93C5FD"/>
      <path d="M270 170 A50 50 0 0 0 220 120 A65 65 0 0 0 155 150 A40 40 0 0 0 120 185 L290 185 A35 35 0 0 0 270 170Z" fill="#60A5FA"/>
      <rect x="170" y="195" width="60" height="70" rx="6" fill="#2563EB"/>
      <path d="M200 210 L185 225 L193 225 L193 245 L207 245 L207 225 L215 225Z" fill="white"/>
      <line x1="150" y1="270" x2="250" y2="270" stroke="#93C5FD" stroke-width="3" stroke-linecap="round"/>
      <line x1="165" y1="280" x2="235" y2="280" stroke="#BFDBFE" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },

  // ─── Social & People ──────────────────────────────────────────
  {
    id: 'chat-bubbles',
    name: 'Chat Conversation',
    category: 'Social',
    tags: 'chat message conversation bubbles communication talk social',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#ECFDF5"/>
      <rect x="60" y="40" width="180" height="60" rx="20" fill="#6EE7B7"/>
      <polygon points="100,100 120,100 90,125" fill="#6EE7B7"/>
      <line x1="85" y1="62" x2="200" y2="62" stroke="white" stroke-width="6" stroke-linecap="round"/>
      <line x1="85" y1="78" x2="170" y2="78" stroke="white" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
      <rect x="160" y="130" width="200" height="60" rx="20" fill="#34D399"/>
      <polygon points="320,190 300,190 330,215" fill="#34D399"/>
      <line x1="185" y1="152" x2="330" y2="152" stroke="white" stroke-width="6" stroke-linecap="round"/>
      <line x1="185" y1="168" x2="290" y2="168" stroke="white" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
      <rect x="40" y="220" width="150" height="50" rx="20" fill="#A7F3D0"/>
      <line x1="65" y1="242" x2="155" y2="242" stroke="white" stroke-width="6" stroke-linecap="round"/>
      <circle cx="185" cy="252" r="5" fill="#6EE7B7"/><circle cx="200" cy="252" r="5" fill="#6EE7B7"/><circle cx="215" cy="252" r="5" fill="#6EE7B7"/>
    </svg>`,
  },
  {
    id: 'team-group',
    name: 'Team Group',
    category: 'Social',
    tags: 'team group people collaboration community users avatars',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#FEF3C7"/>
      <circle cx="200" cy="100" r="40" fill="#F59E0B"/>
      <circle cx="200" cy="85" r="20" fill="#FDE68A"/>
      <rect x="160" y="140" width="80" height="60" rx="20" fill="#F59E0B"/>
      <circle cx="100" cy="120" r="32" fill="#FB923C"/>
      <circle cx="100" cy="108" r="16" fill="#FED7AA"/>
      <rect x="68" y="152" width="64" height="48" rx="16" fill="#FB923C"/>
      <circle cx="300" cy="120" r="32" fill="#FB923C"/>
      <circle cx="300" cy="108" r="16" fill="#FED7AA"/>
      <rect x="268" y="152" width="64" height="48" rx="16" fill="#FB923C"/>
      <path d="M80 220 Q200 180 320 220 L340 260 L60 260Z" fill="#FBBF24" opacity="0.5"/>
      <line x1="120" y1="250" x2="280" y2="250" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'social-likes',
    name: 'Social Likes',
    category: 'Social',
    tags: 'social likes hearts love appreciation feedback popular',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#FDF2F8"/>
      <path d="M200 240 L130 175 A50 50 0 0 1 200 120 A50 50 0 0 1 270 175Z" fill="#F472B6"/>
      <path d="M120 90 L95 65 A25 25 0 0 1 120 40 A25 25 0 0 1 145 65Z" fill="#FBCFE8" opacity="0.8"/>
      <path d="M310 100 L290 80 A20 20 0 0 1 310 60 A20 20 0 0 1 330 80Z" fill="#FBCFE8" opacity="0.6"/>
      <path d="M80 200 L65 185 A15 15 0 0 1 80 170 A15 15 0 0 1 95 185Z" fill="#F9A8D4" opacity="0.7"/>
      <path d="M340 200 L325 185 A15 15 0 0 1 340 170 A15 15 0 0 1 355 185Z" fill="#F9A8D4" opacity="0.5"/>
      <circle cx="150" cy="50" r="6" fill="#FBBF24"/>
      <circle cx="280" cy="40" r="4" fill="#FBBF24" opacity="0.7"/>
      <circle cx="50" cy="130" r="5" fill="#FBBF24" opacity="0.6"/>
      <circle cx="360" cy="140" r="3" fill="#FBBF24"/>
    </svg>`,
  },

  // ─── Nature ────────────────────────────────────────────────────
  {
    id: 'mountain-landscape',
    name: 'Mountain Landscape',
    category: 'Nature',
    tags: 'mountain landscape nature outdoor scenic hills trees',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#DBEAFE"/>
      <circle cx="320" cy="60" r="35" fill="#FCD34D"/>
      <polygon points="50,280 150,100 250,280" fill="#6B7280"/>
      <polygon points="150,280 270,60 390,280" fill="#4B5563"/>
      <polygon points="150,100 170,130 130,130" fill="white" opacity="0.8"/>
      <polygon points="270,60 300,100 240,100" fill="white" opacity="0.9"/>
      <rect x="0" y="240" width="400" height="60" fill="#16A34A"/>
      <ellipse cx="60" cy="235" rx="25" ry="30" fill="#15803D"/>
      <ellipse cx="340" cy="230" rx="30" ry="35" fill="#15803D"/>
      <ellipse cx="120" cy="238" rx="20" ry="24" fill="#166534"/>
      <rect x="55" y="240" width="10" height="20" fill="#92400E"/>
      <rect x="335" y="235" width="12" height="25" fill="#92400E"/>
    </svg>`,
  },
  {
    id: 'flower-plant',
    name: 'Potted Plant',
    category: 'Nature',
    tags: 'plant flower pot green leaf garden grow indoor',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#F0FDF4"/>
      <rect x="155" y="200" width="90" height="70" rx="8" fill="#D97706"/>
      <rect x="145" y="192" width="110" height="16" rx="4" fill="#B45309"/>
      <rect x="185" y="130" width="10" height="70" fill="#16A34A"/>
      <ellipse cx="170" cy="130" rx="35" ry="30" fill="#22C55E" transform="rotate(-20 170 130)"/>
      <ellipse cx="225" cy="125" rx="30" ry="28" fill="#4ADE80" transform="rotate(15 225 125)"/>
      <ellipse cx="195" cy="100" rx="28" ry="25" fill="#16A34A" transform="rotate(-5 195 100)"/>
      <path d="M170 80 Q195 40 220 80" stroke="#15803D" stroke-width="3" fill="none"/>
      <circle cx="195" cy="70" r="8" fill="#F472B6"/>
      <circle cx="195" cy="70" r="3" fill="#FBBF24"/>
      <circle cx="160" cy="110" r="5" fill="#FB923C"/>
      <circle cx="160" cy="110" r="2" fill="#FBBF24"/>
    </svg>`,
  },
  {
    id: 'sunrise-scene',
    name: 'Sunrise',
    category: 'Nature',
    tags: 'sunrise morning sun sky horizon dawn new beginning',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#FEF3C7"/>
      <rect x="0" y="180" width="400" height="120" fill="#D97706" opacity="0.3"/>
      <circle cx="200" cy="180" r="60" fill="#FBBF24"/>
      <circle cx="200" cy="180" r="45" fill="#FCD34D"/>
      <line x1="200" y1="100" x2="200" y2="115" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <line x1="145" y1="125" x2="155" y2="135" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <line x1="255" y1="125" x2="245" y2="135" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <line x1="120" y1="175" x2="130" y2="175" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <line x1="270" y1="175" x2="280" y2="175" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <path d="M0 200 Q50 185 100 195 Q150 205 200 190 Q250 175 300 195 Q350 215 400 200 L400 300 L0 300Z" fill="#F59E0B" opacity="0.4"/>
      <path d="M0 230 Q80 210 160 225 Q240 240 320 220 Q380 205 400 225 L400 300 L0 300Z" fill="#D97706" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'rainy-day',
    name: 'Rainy Day',
    category: 'Nature',
    tags: 'rain rainy weather cloud drops water umbrella',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#E0F2FE"/>
      <path d="M280 100 A50 50 0 0 0 230 60 A70 70 0 0 0 150 80 A45 45 0 0 0 110 130 L290 130 A40 40 0 0 0 280 100Z" fill="#94A3B8"/>
      <path d="M265 110 A40 40 0 0 0 225 75 A55 55 0 0 0 165 90 A35 35 0 0 0 135 125 L275 125 A30 30 0 0 0 265 110Z" fill="#64748B"/>
      <line x1="140" y1="150" x2="135" y2="190" stroke="#60A5FA" stroke-width="2" stroke-linecap="round"/>
      <line x1="180" y1="145" x2="175" y2="195" stroke="#60A5FA" stroke-width="2" stroke-linecap="round"/>
      <line x1="220" y1="150" x2="215" y2="185" stroke="#60A5FA" stroke-width="2" stroke-linecap="round"/>
      <line x1="260" y1="145" x2="255" y2="200" stroke="#60A5FA" stroke-width="2" stroke-linecap="round"/>
      <line x1="160" y1="160" x2="155" y2="205" stroke="#93C5FD" stroke-width="2" stroke-linecap="round"/>
      <line x1="200" y1="155" x2="195" y2="210" stroke="#93C5FD" stroke-width="2" stroke-linecap="round"/>
      <line x1="240" y1="160" x2="235" y2="195" stroke="#93C5FD" stroke-width="2" stroke-linecap="round"/>
      <path d="M200 230 A60 60 0 0 1 140 230" stroke="#3B82F6" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M200 230 A60 60 0 0 0 260 230" stroke="#3B82F6" stroke-width="4" fill="none" stroke-linecap="round"/>
      <line x1="200" y1="230" x2="200" y2="275" stroke="#3B82F6" stroke-width="4" stroke-linecap="round"/>
      <line x1="200" y1="275" x2="185" y2="285" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },

  // ─── More Abstract ─────────────────────────────────────────────
  {
    id: 'success-celebration',
    name: 'Celebration',
    category: 'Abstract',
    tags: 'celebration success party confetti stars win trophy achievement',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#FFFBEB"/>
      <rect x="160" y="120" width="80" height="100" rx="4" fill="#FBBF24"/>
      <rect x="145" y="110" width="110" height="20" rx="4" fill="#F59E0B"/>
      <rect x="185" y="220" width="30" height="40" fill="#D97706"/>
      <rect x="165" y="255" width="70" height="12" rx="4" fill="#B45309"/>
      <polygon points="200,30 208,58 238,58 214,74 222,102 200,86 178,102 186,74 162,58 192,58" fill="#EAB308"/>
      <circle cx="80" cy="60" r="8" fill="#EF4444" opacity="0.7"/>
      <circle cx="330" cy="80" r="6" fill="#C4704A" opacity="0.7"/>
      <circle cx="60" cy="200" r="5" fill="#22C55E" opacity="0.6"/>
      <circle cx="350" cy="180" r="7" fill="#EC4899" opacity="0.6"/>
      <rect x="100" y="100" width="8" height="8" rx="1" fill="#3B82F6" opacity="0.6" transform="rotate(30 104 104)"/>
      <rect x="300" y="40" width="10" height="10" rx="1" fill="#F97316" opacity="0.7" transform="rotate(45 305 45)"/>
      <rect x="70" y="140" width="6" height="6" rx="1" fill="#FBBF24" opacity="0.8" transform="rotate(15 73 143)"/>
      <polygon points="320,230 325,220 330,230" fill="#EF4444" opacity="0.5"/>
      <polygon points="90,250 95,240 100,250" fill="#C4704A" opacity="0.5"/>
    </svg>`,
  },
  {
    id: 'notification-bell',
    name: 'Notifications',
    category: 'Technology',
    tags: 'notification bell alert badge count update app push',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#FEF2F2"/>
      <path d="M200 60 A70 70 0 0 0 130 130 L130 190 L110 210 L290 210 L270 190 L270 130 A70 70 0 0 0 200 60Z" fill="#FCA5A5"/>
      <path d="M200 60 A70 70 0 0 0 130 130 L130 190 L110 210 L290 210 L270 190 L270 130 A70 70 0 0 0 200 60Z" fill="none" stroke="#EF4444" stroke-width="3"/>
      <line x1="200" y1="35" x2="200" y2="60" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
      <path d="M175 215 A25 25 0 0 0 225 215" stroke="#EF4444" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="265" cy="85" r="25" fill="#EF4444"/>
      <text x="265" y="92" text-anchor="middle" fill="white" font-size="24" font-weight="bold" font-family="sans-serif">3</text>
      <circle cx="120" cy="260" r="4" fill="#FCA5A5"/>
      <circle cx="200" cy="265" r="3" fill="#FECACA"/>
      <circle cx="280" cy="258" r="5" fill="#FCA5A5"/>
    </svg>`,
  },
  {
    id: 'email-inbox',
    name: 'Email Inbox',
    category: 'Social',
    tags: 'email inbox mail envelope message letter communication',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#EFF6FF"/>
      <rect x="80" y="80" width="240" height="160" rx="12" fill="#3B82F6"/>
      <path d="M80 95 L200 170 L320 95" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M80 240 L160 170" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>
      <path d="M320 240 L240 170" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>
      <circle cx="300" cy="90" r="20" fill="#EF4444"/>
      <text x="300" y="97" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="sans-serif">5</text>
      <rect x="100" y="255" width="60" height="8" rx="4" fill="#93C5FD"/>
      <rect x="170" y="255" width="40" height="8" rx="4" fill="#BFDBFE"/>
      <rect x="220" y="255" width="50" height="8" rx="4" fill="#93C5FD"/>
    </svg>`,
  },
  {
    id: 'rocket-launch',
    name: 'Rocket Launch',
    category: 'Business',
    tags: 'rocket launch startup growth takeoff speed innovation boost',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#faeee5"/>
      <path d="M200 30 Q220 80 220 140 L180 140 Q180 80 200 30Z" fill="#E2E8F0"/>
      <path d="M200 30 Q210 80 210 140 L190 140 Q190 80 200 30Z" fill="#CBD5E1"/>
      <circle cx="200" cy="90" r="12" fill="#60A5FA"/>
      <circle cx="200" cy="90" r="7" fill="#93C5FD"/>
      <path d="M180 110 L155 140 L180 130Z" fill="#94A3B8"/>
      <path d="M220 110 L245 140 L220 130Z" fill="#94A3B8"/>
      <path d="M185 140 L190 180 L200 170 L210 180 L215 140Z" fill="#F97316"/>
      <path d="M190 150 L195 175 L200 165 L205 175 L210 150Z" fill="#FBBF24"/>
      <circle cx="150" cy="200" r="8" fill="#e8c4a8" opacity="0.6"/>
      <circle cx="250" cy="190" r="6" fill="#f0dcc8" opacity="0.5"/>
      <circle cx="130" cy="240" r="5" fill="#E9D5FF" opacity="0.4"/>
      <circle cx="270" cy="250" r="7" fill="#e8c4a8" opacity="0.3"/>
      <circle cx="180" cy="260" r="4" fill="#f0dcc8" opacity="0.5"/>
      <circle cx="220" cy="230" r="5" fill="#E9D5FF" opacity="0.4"/>
    </svg>`,
  },
];

/** All available categories */
const ALL_CATEGORIES = ['All', ...new Set(ILLUSTRATIONS.map((i) => i.category))].sort((a, b) => {
  if (a === 'All') return -1;
  if (b === 'All') return 1;
  return a.localeCompare(b);
});

/**
 * Get all illustration categories.
 */
export function getIllustrationCategories(): string[] {
  return ALL_CATEGORIES;
}

/**
 * Filter illustrations by search query and/or category.
 */
export function filterIllustrations(query: string, category: string): Illustration[] {
  const q = query.toLowerCase().trim();
  const filterCategory = category && category !== 'All';

  if (!q && !filterCategory) return ILLUSTRATIONS;

  return ILLUSTRATIONS.filter((illus) => {
    if (filterCategory && illus.category !== category) return false;
    if (q && !illus.name.toLowerCase().includes(q) && !illus.tags.includes(q)) return false;
    return true;
  });
}

/**
 * Get all illustrations.
 */
export function getAllIllustrations(): Illustration[] {
  return ILLUSTRATIONS;
}
