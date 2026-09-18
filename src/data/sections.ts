import { SectionContent } from '../types/book';
import { CH01_01_LITERATE_PROGRAMMING } from './books/pbrt-4ed/content/ch01_01_literate_programming';
import { CH01_02_RAY_TRACING } from './books/pbrt-4ed/content/ch01_02_ray_tracing';
import { CH01_03_SYSTEM_OVERVIEW } from './books/pbrt-4ed/content/ch01_03_system_overview';
import { CH01_04_HOW_TO_PROCEED } from './books/pbrt-4ed/content/ch01_04_how_to_proceed';
import { CH01_05_USING_AND_UNDERSTANDING } from './books/pbrt-4ed/content/ch01_05_using_and_understanding';
import { CH01_06_HISTORY } from './books/pbrt-4ed/content/ch01_06_history';
import { CH02_01_MONTE_CARLO_BASICS } from './books/pbrt-4ed/content/ch02_01_monte_carlo_basics';
import { CH02_02_IMPROVING_EFFICIENCY } from './books/pbrt-4ed/content/ch02_02_improving_efficiency';
import { CH02_03_INVERSION_METHOD } from './books/pbrt-4ed/content/ch02_03_inversion_method';
import { CH02_04_TRANSFORMING_DISTRIBUTIONS } from './books/pbrt-4ed/content/ch02_04_transforming_distributions';
import { CH03_01_COORDINATE_SYSTEMS } from './books/pbrt-4ed/content/ch03_01_coordinate_systems';
import { CH03_02_NTUPLE_BASE } from './books/pbrt-4ed/content/ch03_02_ntuple_base';
import { CH03_03_VECTORS } from './books/pbrt-4ed/content/ch03_03_vectors';
import { CH03_04_POINTS } from './books/pbrt-4ed/content/ch03_04_points';
import { CH03_05_NORMALS } from './books/pbrt-4ed/content/ch03_05_normals';
import { CH03_06_RAYS } from './books/pbrt-4ed/content/ch03_06_rays';
import { CH03_07_BOUNDING_BOXES } from './books/pbrt-4ed/content/ch03_07_bounding_boxes';
import { CH03_08_SPHERICAL_GEOMETRY } from './books/pbrt-4ed/content/ch03_08_spherical_geometry';
import { CH03_09_TRANSFORMATIONS } from './books/pbrt-4ed/content/ch03_09_transformations';
import { CH03_10_APPLYING_TRANSFORMATIONS } from './books/pbrt-4ed/content/ch03_10_applying_transformations';
import { CH03_11_INTERACTIONS } from './books/pbrt-4ed/content/ch03_11_interactions';
import { CH04_01_RADIOMETRY } from './books/pbrt-4ed/content/ch04_01_radiometry';
import { CH04_02_RADIOMETRIC_INTEGRALS } from './books/pbrt-4ed/content/ch04_02_radiometric_integrals';
import { CH04_03_SURFACE_REFLECTION } from './books/pbrt-4ed/content/ch04_03_surface_reflection';
import { CH04_04_LIGHT_EMISSION } from './books/pbrt-4ed/content/ch04_04_light_emission';
import { CH04_05_SPECTRAL_DISTRIBUTIONS } from './books/pbrt-4ed/content/ch04_05_spectral_distributions';
import { CH04_06_COLOR } from './books/pbrt-4ed/content/ch04_06_color';
import { CH05_01_CAMERA_INTERFACE } from './books/pbrt-4ed/content/ch05_01_camera_interface';
import { CH05_02_PROJECTIVE_CAMERA } from './books/pbrt-4ed/content/ch05_02_projective_camera';
import { CH05_03_SPHERICAL_CAMERA } from './books/pbrt-4ed/content/ch05_03_spherical_camera';
import { CH05_04_FILM_AND_IMAGING } from './books/pbrt-4ed/content/ch05_04_film_and_imaging';
import { CH06_01_BASIC_SHAPE_INTERFACE } from './books/pbrt-4ed/content/ch06_01_basic_shape_interface';
import { CH06_02_SPHERES } from './books/pbrt-4ed/content/ch06_02_spheres';
import { CH06_03_CYLINDERS } from './books/pbrt-4ed/content/ch06_03_cylinders';
import { CH06_04_DISKS } from './books/pbrt-4ed/content/ch06_04_disks';
import { CH06_05_TRIANGLE_MESHES } from './books/pbrt-4ed/content/ch06_05_triangle_meshes';
import { CH06_06_BILINEAR_PATCHES } from './books/pbrt-4ed/content/ch06_06_bilinear_patches';
import { CH06_07_CURVES } from './books/pbrt-4ed/content/ch06_07_curves';
import { CH06_08_MANAGING_ROUNDING_ERROR } from './books/pbrt-4ed/content/ch06_08_managing_rounding_error';
import { CH07_01_PRIMITIVE_INTERFACE } from './books/pbrt-4ed/content/ch07_01_primitive_interface';
import { CH07_02_AGGREGATES } from './books/pbrt-4ed/content/ch07_02_aggregates';
import { CH07_03_BVH } from './books/pbrt-4ed/content/ch07_03_bvh';
import { CH08_01_SAMPLING_THEORY } from './books/pbrt-4ed/content/ch08_01_sampling_theory';
import { CH08_02_SAMPLING_AND_INTEGRATION } from './books/pbrt-4ed/content/ch08_02_sampling_and_integration';
import { CH08_03_SAMPLING_INTERFACE } from './books/pbrt-4ed/content/ch08_03_sampling_interface';
import { CH08_04_INDEPENDENT_SAMPLER } from './books/pbrt-4ed/content/ch08_04_independent_sampler';
import { CH08_05_STRATIFIED_SAMPLER } from './books/pbrt-4ed/content/ch08_05_stratified_sampler';
import { CH08_06_HALTON_SAMPLER } from './books/pbrt-4ed/content/ch08_06_halton_sampler';
import { CH08_07_SOBOL_SAMPLER } from './books/pbrt-4ed/content/ch08_07_sobol_sampler';
import { CH08_08_IMAGE_RECONSTRUCTION } from './books/pbrt-4ed/content/ch08_08_image_reconstruction';

export const SECTIONS_MAP: Record<string, SectionContent> = {
  // Chapter 1: Introduction (All 6 sections complete)
  'ch01-01': CH01_01_LITERATE_PROGRAMMING,
  'ch01-02': CH01_02_RAY_TRACING,
  'ch01-03': CH01_03_SYSTEM_OVERVIEW,
  'ch01-04': CH01_04_HOW_TO_PROCEED,
  'ch01-05': CH01_05_USING_AND_UNDERSTANDING,
  'ch01-06': CH01_06_HISTORY,

  // Chapter 2: Monte Carlo Integration (All 4 sections complete)
  'ch02-01': CH02_01_MONTE_CARLO_BASICS,
  'ch02-02': CH02_02_IMPROVING_EFFICIENCY,
  'ch02-03': CH02_03_INVERSION_METHOD,
  'ch02-04': CH02_04_TRANSFORMING_DISTRIBUTIONS,

  // Chapter 3: Geometry and Transformations (All 11 sections complete)
  'ch03-01': CH03_01_COORDINATE_SYSTEMS,
  'ch03-02': CH03_02_NTUPLE_BASE,
  'ch03-03': CH03_03_VECTORS,
  'ch03-04': CH03_04_POINTS,
  'ch03-05': CH03_05_NORMALS,
  'ch03-06': CH03_06_RAYS,
  'ch03-07': CH03_07_BOUNDING_BOXES,
  'ch03-08': CH03_08_SPHERICAL_GEOMETRY,
  'ch03-09': CH03_09_TRANSFORMATIONS,
  'ch03-10': CH03_10_APPLYING_TRANSFORMATIONS,
  'ch03-11': CH03_11_INTERACTIONS,

  // Chapter 4: Radiometry, Spectra, and Color (All 6 sections complete)
  'ch04-01': CH04_01_RADIOMETRY,
  'ch04-02': CH04_02_RADIOMETRIC_INTEGRALS,
  'ch04-03': CH04_03_SURFACE_REFLECTION,
  'ch04-04': CH04_04_LIGHT_EMISSION,
  'ch04-05': CH04_05_SPECTRAL_DISTRIBUTIONS,
  'ch04-06': CH04_06_COLOR,

  // Chapter 5: Cameras and Film (All 4 sections complete)
  'ch05-01': CH05_01_CAMERA_INTERFACE,
  'ch05-02': CH05_02_PROJECTIVE_CAMERA,
  'ch05-03': CH05_03_SPHERICAL_CAMERA,
  'ch05-04': CH05_04_FILM_AND_IMAGING,

  // Chapter 6: Shapes (All 8 sections complete)
  'ch06-01': CH06_01_BASIC_SHAPE_INTERFACE,
  'ch06-02': CH06_02_SPHERES,
  'ch06-03': CH06_03_CYLINDERS,
  'ch06-04': CH06_04_DISKS,
  'ch06-05': CH06_05_TRIANGLE_MESHES,
  'ch06-06': CH06_06_BILINEAR_PATCHES,
  'ch06-07': CH06_07_CURVES,
  'ch06-08': CH06_08_MANAGING_ROUNDING_ERROR,

  // Chapter 7: Primitives and Intersection Acceleration (All 3 sections complete)
  'ch07-01': CH07_01_PRIMITIVE_INTERFACE,
  'ch07-02': CH07_02_AGGREGATES,
  'ch07-03': CH07_03_BVH,

  // Chapter 8: Sampling and Reconstruction (All 8 sections complete)
  'ch08-01': CH08_01_SAMPLING_THEORY,
  'ch08-02': CH08_02_SAMPLING_AND_INTEGRATION,
  'ch08-03': CH08_03_SAMPLING_INTERFACE,
  'ch08-04': CH08_04_INDEPENDENT_SAMPLER,
  'ch08-05': CH08_05_STRATIFIED_SAMPLER,
  'ch08-06': CH08_06_HALTON_SAMPLER,
  'ch08-07': CH08_07_SOBOL_SAMPLER,
  'ch08-08': CH08_08_IMAGE_RECONSTRUCTION,
};

export function getSectionContent(sectionId: string): SectionContent | null {
  return SECTIONS_MAP[sectionId] || null;
}
