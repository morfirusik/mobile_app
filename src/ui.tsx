import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { Dispatch, ReactNode } from 'react';
import {
  Activity,
  ArrowDownLeft,
  ArrowRight,
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Flag,
  Footprints,
  Heart,
  Leaf,
  MapPin,
  Minus,
  Mountain,
  Plus,
  Sparkles,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import type { Action, State } from './store';
import type { LocalText, Route } from './data';

export type Page =
  | 'home'
  | 'routes'
  | 'run'
  | 'statistics'
  | 'challenges'
  | 'health'
  | 'community'
  | 'charity'
  | 'assistant'
  | 'profile'
  | 'settings';
export const AppContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
  navigate: (p: Page) => void;
  notify: (text: string) => void;
  t: (ru: string, kk: string) => string;
  l: (v: LocalText) => string;
}>({} as never);
export const useApp = () => useContext(AppContext);
export function Icon({
  name,
  size = 22,
  ...rest
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const C =
    (
      {
        foot: Footprints,
        flag: Flag,
        flame: Activity,
        heart: Heart,
        tree: Leaf,
        people: Users,
        trophy: Trophy,
        water: Droplets,
        award: Award,
        mountain: Mountain,
        sparkles: Sparkles,
      } as Record<string, typeof Heart>
    )[name] || Activity;
  return <C size={size} strokeWidth={1.8} {...rest} />;
}
export function SectionTitle({
  title,
  action,
  onClick,
  eyebrow,
}: {
  title: string;
  action?: string;
  onClick?: () => void;
  eyebrow?: string;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="text-button" onClick={onClick}>
          {action}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
export function Progress({
  value,
  max = 100,
  className = '',
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  return (
    <div
      className={`progress ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <span style={{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }} />
    </div>
  );
}
export function Badge({ children, kind = '' }: { children: ReactNode; kind?: string }) {
  return <span className={`badge ${kind}`}>{children}</span>;
}
export function Empty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <Footprints size={34} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const { t } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled),input,select,textarea,[tabindex="0"]',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first || document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', key);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-heading">
          <h2 id={titleId}>{title}</h2>
          <button className="icon-button" aria-label={t('Закрыть', 'Жабу')} onClick={onClose}>
            <X size={21} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function Scene({
  variant = 'city',
  className = '',
}: {
  variant?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={`scene ${className}`}
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={variant === 'mountains' ? 'Mountain illustration' : 'Park illustration'}
    >
      <defs>
        <linearGradient id={`${id}s`} x2="0" y2="1">
          <stop stopColor="#b9d8d6" />
          <stop offset="1" stopColor="#f1e9ce" />
        </linearGradient>
        <linearGradient id={`${id}g`} x2="0" y2="1">
          <stop stopColor="#7e9f7a" />
          <stop offset="1" stopColor="#294e40" />
        </linearGradient>
        <linearGradient id={`${id}p`} x2="0" y2="1">
          <stop stopColor="#e9e4cf" />
          <stop offset="1" stopColor="#bbbea1" />
        </linearGradient>
      </defs>
      <rect width="900" height="520" fill={`url(#${id}s)`} />
      <circle cx="692" cy="96" r="48" fill="#f8e6af" opacity=".9" />
      <path
        d="M0 265 90 170 159 210 280 80 359 160 422 100 512 207 610 123 735 234 820 151 900 218V420H0Z"
        fill="#a2b9b1"
      />
      <path
        d="m213 153 67-73 79 80-56-24-22-24-21 35-23-7Z M393 128l29-28 50 61-34-17-17-24-14 17Z"
        fill="#eaf0e5"
      />
      <path
        d="M0 295 123 222 220 279 350 202 451 284 563 225 689 288 806 233 900 286V520H0Z"
        fill="#72958a"
      />
      <path d="M0 344Q180 260 390 318T900 294V520H0Z" fill={`url(#${id}g)`} />
      {variant === 'city' && (
        <g>
          <g fill="#d5d6bd">
            <path d="M440 293V224h35v69M486 291V207h45v84M541 292V237h37v55M595 296V214h50v82M671 296V234h36v62" />
            <path d="M735 294v-58h56v58" />
          </g>
          <g fill="#7d9b8d">
            {[447, 460, 494, 510, 549, 563, 604, 623, 681, 746, 770].map((x, i) => (
              <path key={i} d={`M${x} 248h5v8h-5zM${x} 265h5v8h-5z`} />
            ))}
          </g>
          <path d="M358 330h75v-13h-75z" fill="#ebe4cf" />
          <path d="M369 317h53v-10h-53z" fill="#c5c5ac" />
          <path d="m382 307 9-115h10l9 115" fill="#e9e2cb" />
          <path d="m391 192 5-14 5 14" fill="#c3a76b" />
          <circle cx="396" cy="173" r="7" fill="#bd9e60" />
          <path d="M655 326v-33q24-43 48 0v33" fill="#d4d6b9" />
          <path d="M648 326h62v8h-62z" fill="#d8d8bf" />
          <path d="M674 326v-25q6-14 12 0v25" fill="#6d8d7c" />
        </g>
      )}
      <path
        d={
          variant === 'mountains'
            ? 'M310 520Q570 439 461 374T580 312L591 314Q513 362 552 390T580 520Z'
            : 'M220 520Q410 434 420 341L441 341Q455 426 650 520Z'
        }
        fill={`url(#${id}p)`}
      />
      <path
        d="M0 432q125-33 230-4M650 406q131-24 250 17"
        fill="none"
        stroke="#b4c295"
        strokeWidth="3"
        opacity=".5"
      />
      {[
        { x: 60, y: 330, s: 1.2 },
        { x: 165, y: 310, s: 0.85 },
        { x: 252, y: 330, s: 0.72 },
        { x: 780, y: 330, s: 1.05 },
        { x: 856, y: 340, s: 1.2 },
        { x: 537, y: 329, s: 0.6 },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
          <path d="M0-10v88" stroke="#5a6750" strokeWidth="7" />
          <ellipse cx="0" cy="-8" rx="39" ry="60" fill={i % 2 ? '#547c59' : '#3b6953'} />
          <ellipse cx="-10" cy="-22" rx="24" ry="38" fill="#70916b" opacity=".65" />
        </g>
      ))}
      {variant === 'forest' &&
        [330, 475, 615, 710].map((x, i) => (
          <g key={x} transform={`translate(${x} ${300 + i * 8})`}>
            <path d="M0 0v82" stroke="#625e42" strokeWidth="8" />
            <path d="M-47 32 0-80 47 32Z" fill={i % 2 ? '#3e6b50' : '#5c8057'} />
            <path d="M-39-4 0-100 39-4Z" fill="#517b56" />
          </g>
        ))}
      <g transform="translate(475 423) rotate(-8)">
        <circle cx="3" cy="-39" r="9" fill="#bd9275" />
        <path d="m0-27-9 29 15 5 10-27Z" fill="#cf754f" />
        <path
          d="m-7-20-17 13-12-8M11-17l15 12 14-7"
          stroke="#bd9275"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="m-5 4-14 22-19 7M8 7l13 19-3 22"
          stroke="#2e4240"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />
        <path d="m-40 34 12 1M15 50h13" stroke="#eeead5" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g fill="#d9d8a9" opacity=".75">
        <circle cx="92" cy="467" r="3" />
        <circle cx="104" cy="461" r="2" />
        <circle cx="720" cy="475" r="3" />
        <circle cx="739" cy="480" r="2" />
      </g>
    </svg>
  );
}
export function RouteMap({ route, progress = 0 }: { route: Route; progress?: number }) {
  const { t } = useApp();
  const [zoom, setZoom] = useState(1);
  const path = useRef<SVGPathElement>(null);
  const [point, setPoint] = useState({ x: 100, y: 280 });
  useEffect(() => {
    if (path.current) {
      const p = path.current.getPointAtLength(
        path.current.getTotalLength() * Math.min(1, Math.max(0, progress)),
      );
      setPoint({ x: p.x, y: p.y });
    }
  }, [route, progress]);
  return (
    <div className="route-map">
      <svg
        viewBox="0 0 420 380"
        role="img"
        aria-label={t('Схема выбранного маршрута', 'Таңдалған бағыттың сызбасы')}
      >
        <rect width="420" height="380" fill="#edf0e7" />
        <g transform={`translate(${210 - 210 * zoom} ${190 - 190 * zoom}) scale(${zoom})`}>
          <path
            d="M40 40h130v90H40zM210 45h150v60H210zM45 185h90v80H45zM190 145h135v135H190zM70 300h85v55H70zM210 310h160v55H210z"
            fill="#dae4ce"
            rx="12"
          />
          <path
            d="m-20 150 480-30M165-10l-10 410M-10 290l450 10M360-10l-10 420M-10 45l470-5"
            stroke="#fffdf6"
            strokeWidth="20"
            fill="none"
          />
          <path
            d="M-10 150 450 120M165-10l-10 410M-10 290l450 10"
            stroke="#dcdccc"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M0 360Q80 330 100 380M300 0q-20 50 120 70"
            stroke="#b8d7da"
            strokeWidth="17"
            fill="none"
          />
          <g fill="#c7d5b8">
            {[
              [55, 60],
              [75, 85],
              [120, 60],
              [230, 70],
              [290, 65],
              [310, 85],
              [225, 180],
              [265, 210],
              [295, 245],
              [70, 220],
              [90, 250],
              [245, 335],
              [320, 335],
            ].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="9" />
            ))}
          </g>
          <g fill="#90a3a0" fontSize="10" fontFamily="sans-serif">
            <text x="25" y="139">
              {t('Шымкент', 'Шымкент')}
            </text>
            <text x="218" y="295">
              {t('Городской маршрут', 'Қалалық бағыт')}
            </text>
          </g>
          <path d={route.path} fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" />
          <path
            ref={path}
            d={route.path}
            fill="none"
            stroke="#2d6752"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={progress > 0 ? undefined : '9 5'}
          />
          <circle cx={point.x} cy={point.y} r="16" fill="#35684f" opacity=".15" />
          <circle cx={point.x} cy={point.y} r="8" fill="#285b45" stroke="white" strokeWidth="4" />
        </g>
      </svg>
      <div className="map-tag">
        <MapPin size={14} />
        {t('Схема · демо', 'Сызба · демо')}
      </div>
      <div className="map-controls">
        <button
          aria-label={t('Приблизить', 'Үлкейту')}
          onClick={() => setZoom((z) => Math.min(1.8, z + 0.2))}
          disabled={zoom >= 1.8}
        >
          <Plus size={18} />
        </button>
        <button
          aria-label={t('Отдалить', 'Кішірейту')}
          onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
          disabled={zoom <= 1}
        >
          <Minus size={18} />
        </button>
      </div>
    </div>
  );
}
export function BackButton({ onClick }: { onClick: () => void }) {
  const { t } = useApp();
  return (
    <button className="text-button back-button" onClick={onClick}>
      <ChevronLeft size={18} />
      {t('Назад', 'Артқа')}
    </button>
  );
}
export function ListLink({
  icon,
  title,
  subtitle,
  onClick,
  trailing,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  trailing?: ReactNode;
}) {
  return (
    <button className="list-link" onClick={onClick}>
      <span className="icon-tile">{icon}</span>
      <span className="list-copy">
        <strong>{title}</strong>
        {subtitle && <small>{subtitle}</small>}
      </span>
      {trailing || <ChevronRight size={18} />}
    </button>
  );
}
export function Achievement({
  icon,
  title,
  unlocked = true,
}: {
  icon: string;
  title: string;
  unlocked?: boolean;
}) {
  return (
    <div className={`achievement ${unlocked ? '' : 'locked'}`}>
      <span>
        <Icon name={icon} size={25} />
        {unlocked && (
          <i>
            <Check size={10} />
          </i>
        )}
      </span>
      <small>{title}</small>
    </div>
  );
}
export function TransactionIcon() {
  return (
    <span className="icon-tile">
      <ArrowDownLeft size={20} />
    </span>
  );
}
