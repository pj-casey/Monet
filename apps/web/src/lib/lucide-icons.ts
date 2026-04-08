/**
 * Lucide Icon Registry — lazy-loaded, searchable, categorized.
 *
 * Instead of bundling all ~1937 Lucide icons upfront, this module
 * lazy-loads the icon data when the user first opens the Icons tab.
 * The metadata (names, categories, search tags) is built on first load
 * and cached in memory.
 *
 * Each icon is stored as an array of SVG element tuples:
 *   [["path", { d: "M..." }], ["circle", { cx: "12", cy: "12", r: "10" }]]
 *
 * This supports all SVG element types Lucide uses: path, circle, rect,
 * line, polyline, ellipse, polygon.
 *
 * Lucide icons are MIT licensed. Source: https://lucide.dev
 * All icons use a 24×24 viewBox, stroke-based, strokeWidth=2.
 */

/** A single SVG element: [tagName, attributes] */
export type SvgNode = [string, Record<string, string>];

export interface LucideIcon {
  /** Display name, e.g. "Arrow Right" */
  name: string;
  /** Original PascalCase key, e.g. "ArrowRight" */
  key: string;
  /** Category for filtering */
  category: string;
  /** Lowercase search terms (name words + category) */
  searchText: string;
  /** SVG element nodes — passed to canvas engine */
  nodes: SvgNode[];
}

// ─── Category mapping ─────────────────────────────────────────────
// Maps keyword patterns found in icon names to categories.
// Order matters — first match wins.

const CATEGORY_RULES: [RegExp, string][] = [
  [/^(Arrow|Chevron|Move|Corner|Undo|Redo|RotateCc?w|Repeat|Flip|Iterate|Forward|Rewind|Skip|Navigation|Compass|Route|Merge|Split|Waypoint|Milestone|SignPost|Orbit)/, 'Arrows & Navigation'],
  [/^(File|Folder|Archive|Clipboard|Copy|Save|HardDrive|Database|FileText|FileCode|FilePlus|FileCheck|FileMinus|FileX|FileSearch|FileEdit|FileUp|FileDown|FileOutput|FileInput|FileJson|FileLock|FileHeart|FileKey|FileWarning|FileQuestion|FileSpreadsheet|FileBadge|FileStack|FolderOpen|FolderPlus|FolderMinus|FolderX|FolderCheck|FolderSearch|FolderEdit|FolderUp|FolderDown|FolderOutput|FolderInput|FolderLock|FolderHeart|FolderKey|FolderTree|FolderGit|FolderArchive|FolderClosed|FolderDot|FolderSync|Notebook|Book|Library|ScrollText|NotepadText|Scroll)/, 'Files & Folders'],
  [/^(User|Users|Contact|PersonStanding|Baby|Accessibility|UserPlus|UserMinus|UserX|UserCheck|UserRound)/, 'People'],
  [/^(Mail|MessageCircle|MessageSquare|Phone|AtSign|Send|Inbox|Voicemail|Megaphone|Radio|Podcast|Mic|AudioLines|AudioWaveform|Speech|BellRing|Bell|PhoneCall|PhoneForwarded|PhoneMissed|PhoneOff|PhoneIncoming|PhoneOutgoing|Antenna|Satellite|Signal|Rss|MessagesSquare|Reply|Newspaper)/, 'Communication'],
  [/^(Heart|Star|ThumbsUp|ThumbsDown|Award|Trophy|Crown|Medal|Flame|Gem|Bookmark|Flag|Badge|Sparkle|PartyPopper|Cake|Gift|Ribbon|Candy|Lollipop)/, 'Social & Rewards'],
  [/^(Camera|Image|Video|Film|Youtube|Music|Headphone|Speaker|Volume|Play|Pause|StopCircle|Clapperboard|Tv|Monitor|Screen|Projector|Presentation|Cast|Airplay|Album|Disc|Aperture|Focus|Scan|ScanLine|ScanSearch|GalleryVertical|GalleryHorizontal|Images|Podcast|Mic|Webcam|Videotape|CirclePlay|CirclePause|CircleStop)/, 'Media'],
  [/^(Sun|Moon|Cloud|Thermometer|Wind|Droplet|Snowflake|Umbrella|Rainbow|Sunrise|Sunset|Tornado|Haze|Cloudy|CloudRain|CloudSnow|CloudSun|CloudMoon|CloudLightning|CloudDrizzle|CloudFog|Waves)/, 'Weather'],
  [/^(Leaf|Trees?|Flower|Sprout|Clover|Bug|Bird|Fish|Cat|Dog|Turtle|Rabbit|Squirrel|Rat|Snail|Worm|Egg|Beef|Bone|Paw|Shell|Mountain|MountainSnow|Footprints|Vegan)/, 'Nature & Animals'],
  [/^(ShoppingCart|ShoppingBag|CreditCard|DollarSign|Euro|PoundSterling|JapaneseYen|IndianRupee|RussianRuble|SwissFranc|Bitcoin|Coins|Wallet|Receipt|Banknote|CircleDollarSign|BadgeDollar|BadgePercent|BadgeCent|Tag|Tags|Percent|Store|Package|Truck|Warehouse|Barcode|QrCode|HandCoins|PiggyBank|Landmark|Building)/, 'Commerce'],
  [/^(Lock|Unlock|Key|Shield|Eye|EyeOff|Fingerprint|ScanFace|KeyRound|LockOpen|LockKeyhole|ShieldCheck|ShieldAlert|ShieldOff|ShieldQuestion|ShieldPlus|ShieldBan|ShieldHalf|Siren|TriangleAlert)/, 'Security'],
  [/^(Settings|Wrench|Hammer|Tool|Cog|Nut|Screwdriver|Drill|Paintbrush|PaintBucket|Palette|Pen|Pencil|PenTool|Eraser|Ruler|Scissors|Slice|Brush|Pipette|Paintbrush2|PenLine|Highlighter)/, 'Tools & Settings'],
  [/^(Search|Filter|SortAsc|SortDesc|List|Grid|Layout|Sidebar|Panel|Columns|Rows|Table|Kanban|GanttChart|Menu|MoreHorizontal|MoreVertical|Maximize|Minimize|Expand|Shrink|Fullscreen|PanelLeft|PanelRight|PanelTop|PanelBottom|AppWindow|Blocks|Component|Puzzle|SquareStack|Layers)/, 'Layout & UI'],
  [/^(Check|X|Plus|Minus|Slash|Hash|AlertCircle|AlertTriangle|AlertOctagon|Info|HelpCircle|CircleCheck|CircleX|CircleAlert|CirclePlus|CircleMinus|CircleDot|CircleSlash|CircleDashed|Ban|OctagonAlert|TriangleAlert|ShieldAlert|BadgeAlert|BadgeCheck|BadgeX|BadgeInfo|BadgeMinus|BadgePlus|BadgeHelp|SquareCheck|SquareX)/, 'Status & Indicators'],
  [/^(Map|MapPin|Globe|Compass|Navigation|Locate|Crosshair|Earth|Mountain|Land|Plane|Car|Bus|Train|Bike|Ship|Rocket|Sailboat|Anchor|Fuel|Tractor|TramFront|TrainFront|CarFront|BusFront|Ambulance|Forklift|Construction|Cone)/, 'Maps & Travel'],
  [/^(Code|Terminal|Binary|Braces|Brackets|Variable|Function|Regex|Bug|GitBranch|GitCommit|GitMerge|GitPullRequest|GitFork|Github|Gitlab|Codepen|Container|Server|Cpu|MemoryStick|HardDrive|Database|Cloud|CloudUpload|CloudDownload|Wifi|Bluetooth|Cable|Plug|Network|Router|ServerCog|Webhook|Api|SquareCode|FileCode|TerminalSquare|MonitorDot)/, 'Development'],
  [/^(Circle|Square|Triangle|Hexagon|Octagon|Pentagon|Diamond|Rectangle|Cylinder|Box|Cube|Cone|Pyramid|Torus|Spline|Orbit|Star|Heart|Gem)/, 'Shapes'],
  [/^(Download|Upload|Share|Link|ExternalLink|Unlink|QrCode|Paperclip|Pin|Unplug|Import|PlugZap|Cable|Usb|Nfc|Bluetooth|Wifi|Signal)/, 'Connectivity'],
  [/^(Calendar|Clock|Timer|Watch|Hourglass|History|TimerReset|CalendarDays|CalendarRange|CalendarClock|CalendarCheck|CalendarPlus|CalendarMinus|CalendarX|CalendarSearch|CalendarHeart|Alarm|AlarmClock|Stopwatch)/, 'Date & Time'],
  [/^(Type|Text|Bold|Italic|Underline|Strikethrough|AlignLeft|AlignCenter|AlignRight|AlignJustify|Heading|List|ListOrdered|Quote|Subscript|Superscript|CaseSensitive|CaseUpper|CaseLower|RemoveFormatting|Pilcrow|WrapText|WholeWord|Spell|Languages|Baseline|LetterText|ALargeSmall|AArrow)/, 'Text & Typography'],
  [/^(Stethoscope|Pill|Syringe|Activity|Heart|HeartPulse|Dna|Brain|Bone|Ear|Hand|Footprints|Scan|Cross|Ambulance|Hospital|Microscope|TestTube|Flask|Atom|Radiation|Biohazard|Vial)/, 'Medical & Science'],
  [/^(Home|Building|Building2|School|Church|Castle|Warehouse|Tent|Bed|Sofa|Lamp|LampDesk|LampFloor|Armchair|Bath|Refrigerator|CookingPot|Microwave|WashingMachine|AirVent|Fan|Heater|DoorOpen|DoorClosed|Fence|GlassWater|Wine|Coffee|Cup|Utensils|Pizza|Salad|Sandwich|Popcorn|IceCream|Croissant|Apple|Cherry|Banana|Citrus|Grape|Nut|Carrot|Bean|Soup)/, 'Home & Food'],
  [/^(Gamepad|Dices?|Joystick|Puzzle|Swords|Wand|Crown|Shield|Crosshair|Target|Bomb|Skull|Ghost|Bot|Laugh|Smile|Frown|Meh|Angry|Annoyed|Zap)/, 'Games & Fun'],
  [/^(Laptop|Desktop|Tablet|Smartphone|Watch|Keyboard|Mouse|Printer|Scanner|MonitorSmartphone|TabletSmartphone|MonitorSpeaker)/, 'Devices'],
  [/^(BarChart|LineChart|PieChart|AreaChart|TrendingUp|TrendingDown|Activity|ChartBar|ChartLine|ChartPie|ChartArea|ChartSpline|ChartColumn|ChartScatter|ChartNoAxes|ChartCandlestick|ChartGantt|ChartNetwork)/, 'Charts & Data'],
  [/^(Rotate|Crop|Wand|Sparkles|Palette|Contrast|ZoomIn|ZoomOut|Move|Grab|Hand|Pointer|MousePointer|Lasso|LassoSelect|Spline|BezierCurve|CircleDot|Blend|Droplets|Stamp|Sticker|Frame|PictureInPicture|ImagePlus|ImageMinus|ImageOff|Ratio|Scaling)/, 'Design & Editing'],
  [/^(Briefcase|GraduationCap|Presentation|Newspaper|Megaphone|Vote|Scale|Gavel|Handshake|PlaneTakeoff|PlaneLanding|Luggage|Ticket|Receipt|Calculator|Percent|ClipboardList|ClipboardCheck|ListCheck|ListTodo|CheckSquare|SquarePen|NotebookPen|FilePen|FormInput|TextCursor|SquareDashedBottom)/, 'Business'],
  [/^(Power|Battery|BatteryCharging|BatteryFull|BatteryLow|BatteryMedium|BatteryWarning|Unplug|PlugZap|Plug|Zap|Lightbulb|Flashlight|Lamp|Sun|Sunrise|Sunset|Toggle|SwitchCamera)/, 'Power & Energy'],
];

/**
 * Derive a category from a PascalCase icon name.
 * Tries each rule in order; first match wins. Falls back to "Other".
 */
function categorize(key: string): string {
  for (const [pattern, category] of CATEGORY_RULES) {
    if (pattern.test(key)) return category;
  }
  return 'Other';
}

/**
 * Convert PascalCase to "Title Case" for display.
 * "ArrowRight" → "Arrow Right", "QrCode" → "Qr Code"
 */
function toDisplayName(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

// ─── Lazy loading state ───────────────────────────────────────────

let allIcons: LucideIcon[] | null = null;
let categoryList: string[] | null = null;
let loadPromise: Promise<void> | null = null;

/**
 * Load all Lucide icons. Called once when the Icons tab first opens.
 *
 * Uses dynamic import so the full lucide package (~200KB) is only
 * fetched when the user actually wants to browse icons — not on
 * initial page load.
 */
export async function loadLucideIcons(): Promise<void> {
  if (allIcons) return; // already loaded
  if (loadPromise) return loadPromise; // loading in progress

  loadPromise = (async () => {
    const lucide = await import('lucide');
    const icons: LucideIcon[] = [];
    const categories = new Set<string>();

    for (const [key, nodes] of Object.entries(lucide.icons)) {
      const name = toDisplayName(key);
      const category = categorize(key);
      categories.add(category);
      icons.push({
        name,
        key,
        category,
        searchText: `${name.toLowerCase()} ${category.toLowerCase()}`,
        nodes: nodes as SvgNode[],
      });
    }

    // Sort icons alphabetically within each category
    icons.sort((a, b) => a.name.localeCompare(b.name));

    allIcons = icons;
    categoryList = ['All', ...Array.from(categories).sort()];
  })();

  return loadPromise;
}

/**
 * Get all loaded icons. Returns empty array if not yet loaded.
 */
export function getAllIcons(): LucideIcon[] {
  return allIcons ?? [];
}

/**
 * Get the list of categories (including "All" at index 0).
 */
export function getCategories(): string[] {
  return categoryList ?? ['All'];
}

/**
 * Filter icons by search query and/or category.
 * Both filters are applied simultaneously.
 */
export function filterIcons(query: string, category: string): LucideIcon[] {
  const icons = allIcons ?? [];
  const q = query.toLowerCase().trim();
  const filterCategory = category && category !== 'All';

  if (!q && !filterCategory) return icons;

  return icons.filter((icon) => {
    if (filterCategory && icon.category !== category) return false;
    if (q && !icon.searchText.includes(q)) return false;
    return true;
  });
}

/**
 * Check whether icons have been loaded yet.
 */
export function isLoaded(): boolean {
  return allIcons !== null;
}

/**
 * Build a complete SVG string from Lucide icon node data.
 *
 * Lucide icons use various SVG elements (path, circle, rect, line,
 * polyline, ellipse, polygon). This converts the node tuple format
 * into a valid SVG string that Fabric.js can parse.
 */
export function buildSvgString(nodes: SvgNode[]): string {
  const elements = nodes.map(([tag, attrs]) => {
    const attrStr = Object.entries(attrs)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');
    return `<${tag} ${attrStr} />`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${elements}</svg>`;
}
