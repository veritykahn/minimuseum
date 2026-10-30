/**
 * Regression tests for the photogrammetry viewers (A16).
 *
 * The Harlem Renaissance models crashed to the site's error page when the
 * browser refused a WebGL context: `new THREE.WebGLRenderer()` threw inside a
 * useEffect and nothing caught it. These check that every failure path shows
 * the object's still photograph instead, and that reduced motion and a
 * missing or refused motion/orientation permission do not crash the viewer.
 */
import { existsSync } from 'fs';
import { join } from 'path';
import { render, screen, waitFor } from '@testing-library/react';
import { MODEL_STILLS, type ModelId } from '@/lib/model-stills';
import { startRenderLoop, disposeRenderer, createRenderer } from '@/lib/three-viewer';
import { ModelErrorBoundary } from '@/components/exhibition/ModelFallback';
import HrArtifactViewer from '@/app/exhibitions/harlem-renaissance/artifacts/hr-artifact-viewer';
import ArtifactViewer from '@/app/exhibitions/seeing-is-deceiving/artifacts/artifact-viewer';

// --- three.js stand-ins -----------------------------------------------------

const webgl = { fail: false };
const gltf = { mode: 'pending' as 'pending' | 'error' | 'ok' };
const controlsMade: { autoRotate: boolean }[] = [];

jest.mock('three', () => {
  const vec = () => ({ set: jest.fn(), sub: jest.fn(), clone: jest.fn(), multiplyScalar: jest.fn().mockReturnThis(), x: 1, y: 1, z: 1 });
  const obj = () => ({ position: vec(), add: jest.fn() });
  return {
    Scene: jest.fn(() => ({ add: jest.fn(), background: null })),
    PerspectiveCamera: jest.fn(() => ({ position: vec(), updateProjectionMatrix: jest.fn(), lookAt: jest.fn() })),
    WebGLRenderer: jest.fn(() => {
      if (webgl.fail) throw new Error('Error creating WebGL context.');
      return {
        setSize: jest.fn(),
        setPixelRatio: jest.fn(),
        render: jest.fn(),
        dispose: jest.fn(),
        forceContextLoss: jest.fn(),
        domElement: document.createElement('canvas'),
      };
    }),
    Color: jest.fn(),
    AmbientLight: jest.fn(obj),
    DirectionalLight: jest.fn(obj),
    PointLight: jest.fn(obj),
    Vector3: jest.fn(vec),
    Spherical: jest.fn(),
    Box3: jest.fn(() => ({ setFromObject: jest.fn().mockReturnThis(), getCenter: jest.fn(vec), getSize: jest.fn(vec) })),
    ACESFilmicToneMapping: 4,
    SRGBColorSpace: 'srgb',
  };
});

jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: jest.fn(() => {
    const c = { autoRotate: true, update: jest.fn(), dispose: jest.fn(), target: { set: jest.fn() } };
    controlsMade.push(c);
    return c;
  }),
}));

jest.mock('three/examples/jsm/loaders/GLTFLoader.js', () => ({
  GLTFLoader: jest.fn(() => ({
    setDRACOLoader: jest.fn(),
    load: (_url: string, _onLoad: unknown, _onProgress: unknown, onError: (e: Error) => void) => {
      if (gltf.mode === 'error') setTimeout(() => onError(new Error('404')), 0);
    },
  })),
}));

jest.mock('three/examples/jsm/loaders/DRACOLoader.js', () => ({
  DRACOLoader: jest.fn(() => ({ setDecoderPath: jest.fn() })),
}));

// --- helpers ------------------------------------------------------------------

function setReducedMotion(on: boolean) {
  (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches: on && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

const VIEWERS: { id: ModelId; el: () => React.ReactElement }[] = [
  { id: 'phonograph', el: () => <HrArtifactViewer artifactId="phonograph" /> },
  { id: 'fire-in-the-flint', el: () => <HrArtifactViewer artifactId="fire-in-the-flint" /> },
  { id: 'stereoscope', el: () => <ArtifactViewer artifactId="stereoscope" /> },
  { id: 'stereoscope-cards', el: () => <ArtifactViewer artifactId="stereoscope-cards" /> },
  { id: 'victorian-cards', el: () => <ArtifactViewer artifactId="victorian-cards" /> },
];

const stillOf = (id: ModelId) =>
  screen.queryAllByRole('img').find((img) => img.getAttribute('src') === MODEL_STILLS[id].still);

beforeEach(() => {
  webgl.fail = false;
  gltf.mode = 'pending';
  controlsMade.length = 0;
  setReducedMotion(false);
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// --- tests --------------------------------------------------------------------

describe('every 3D object has a still and a model on disk', () => {
  it.each(Object.entries(MODEL_STILLS))('%s', (_id, s) => {
    expect(s.still).toMatch(/\.webp$/);
    expect(existsSync(join(process.cwd(), 'public', s.still))).toBe(true);
    expect(existsSync(join(process.cwd(), 'public', s.model))).toBe(true);
  });

  it('covers every viewer', () => {
    expect(VIEWERS.map((v) => v.id).sort()).toEqual(Object.keys(MODEL_STILLS).sort());
  });
});

describe('ModelErrorBoundary', () => {
  function Boom(): React.ReactElement {
    throw new Error('viewer exploded');
  }

  it('shows the still, title and a way back when the viewer throws', () => {
    render(
      <ModelErrorBoundary id="phonograph">
        <Boom />
      </ModelErrorBoundary>
    );
    expect(stillOf('phonograph')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: MODEL_STILLS.phonograph.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to the collection/i })).toHaveAttribute(
      'href',
      '/exhibitions/harlem-renaissance/artifacts'
    );
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });

  it('renders the viewer untouched when nothing throws', () => {
    render(
      <ModelErrorBoundary id="stereoscope">
        <p>viewer</p>
      </ModelErrorBoundary>
    );
    expect(screen.getByText('viewer')).toBeInTheDocument();
    expect(screen.queryByTestId('model-still')).not.toBeInTheDocument();
  });
});

describe.each(VIEWERS)('$id viewer', ({ id, el }) => {
  it('shows the still instead of crashing when WebGL is unavailable', () => {
    webgl.fail = true;
    expect(() => render(<ModelErrorBoundary id={id}>{el()}</ModelErrorBoundary>)).not.toThrow();
    expect(stillOf(id)).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /view controls/i })).not.toBeInTheDocument();
    // The page around the model (title, label) is still there.
    expect(screen.getByRole('button', { name: /about this artifact/i })).toBeInTheDocument();
  });

  it('shows the still when the model fails to load', async () => {
    gltf.mode = 'error';
    render(<ModelErrorBoundary id={id}>{el()}</ModelErrorBoundary>);
    await waitFor(() => expect(stillOf(id)).toBeInTheDocument());
  });

  it('does not crash with reduced motion, and starts without turning', () => {
    setReducedMotion(true);
    render(<ModelErrorBoundary id={id}>{el()}</ModelErrorBoundary>);
    expect(screen.queryByTestId('model-still')).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: /view controls/i })).toBeInTheDocument();
    expect(controlsMade.at(-1)?.autoRotate).toBe(false);
  });

  it('does not crash when DeviceOrientationEvent is missing', () => {
    const w = window as unknown as Record<string, unknown>;
    const saved = { o: w.DeviceOrientationEvent, m: w.DeviceMotionEvent };
    delete w.DeviceOrientationEvent;
    delete w.DeviceMotionEvent;
    try {
      render(<ModelErrorBoundary id={id}>{el()}</ModelErrorBoundary>);
      expect(screen.getByRole('group', { name: /view controls/i })).toBeInTheDocument();
    } finally {
      w.DeviceOrientationEvent = saved.o;
      w.DeviceMotionEvent = saved.m;
    }
  });

  it('does not crash when orientation permission is refused or throws', () => {
    const w = window as unknown as Record<string, unknown>;
    const saved = { o: w.DeviceOrientationEvent, m: w.DeviceMotionEvent };
    w.DeviceOrientationEvent = Object.assign(function DeviceOrientationEvent() {}, {
      requestPermission: () => Promise.reject(new Error('NotAllowedError')),
    });
    w.DeviceMotionEvent = Object.assign(function DeviceMotionEvent() {}, {
      requestPermission: () => {
        throw new Error('denied');
      },
    });
    try {
      render(<ModelErrorBoundary id={id}>{el()}</ModelErrorBoundary>);
      expect(screen.getByRole('group', { name: /view controls/i })).toBeInTheDocument();
      expect(screen.queryByTestId('model-still')).not.toBeInTheDocument();
    } finally {
      w.DeviceOrientationEvent = saved.o;
      w.DeviceMotionEvent = saved.m;
    }
  });
});

describe('three-viewer helpers', () => {
  it('createRenderer returns null instead of throwing', () => {
    webgl.fail = true;
    expect(createRenderer()).toBeNull();
  });

  it('disposeRenderer releases the WebGL context', () => {
    const r = createRenderer()!;
    disposeRenderer(r);
    expect(r.dispose).toHaveBeenCalled();
    expect(r.forceContextLoss).toHaveBeenCalled();
  });

  it('startRenderLoop stops, and reports, when a frame throws', () => {
    const frames: FrameRequestCallback[] = [];
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      frames.push(cb);
      return frames.length;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    let n = 0;
    const onError = jest.fn();
    startRenderLoop(() => {
      n++;
      if (n === 2) throw new Error('context lost');
    }, onError);
    frames.shift()!(0);
    frames.shift()!(0);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(frames).toHaveLength(0);
  });

  it('startRenderLoop stop() cancels the next frame', () => {
    const cancel = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 7);
    const stop = startRenderLoop(() => {});
    stop();
    expect(cancel).toHaveBeenCalledWith(7);
  });
});
