import type { Lang } from '../i18n/ui';

import HomeEs from './es/home.astro';
import TesisEs from './es/tesis.astro';
import SupermercadoEs from './es/supermercado.astro';
import CasinoEs from './es/casino.astro';
import EmpresaTransporteEs from './es/empresaTransporte.astro';
import AutoescuelaEs from './es/autoescuela.astro';
import DockerEs from './es/docker.astro';
import TiendaJuegosDeMesaEs from './es/tiendaJuegosDeMesa.astro';

import HomeEn from './en/home.astro';
import TesisEn from './en/tesis.astro';
import SupermercadoEn from './en/supermercado.astro';
import CasinoEn from './en/casino.astro';
import EmpresaTransporteEn from './en/empresaTransporte.astro';
import AutoescuelaEn from './en/autoescuela.astro';
import DockerEn from './en/docker.astro';
import TiendaJuegosDeMesaEn from './en/tiendaJuegosDeMesa.astro';

/**
 * Cuerpo de cada pagina por idioma. Un idioma puede estar incompleto: las rutas
 * se generan a partir de estas claves, asi que una traduccion a medias compila.
 */
export const content = {
  es: {
    home: HomeEs,
    tesis: TesisEs,
    supermercado: SupermercadoEs,
    casino: CasinoEs,
    empresaTransporte: EmpresaTransporteEs,
    autoescuela: AutoescuelaEs,
    docker: DockerEs,
    tiendaJuegosDeMesa: TiendaJuegosDeMesaEs,
  },
  en: {
    home: HomeEn,
    tesis: TesisEn,
    supermercado: SupermercadoEn,
    casino: CasinoEn,
    empresaTransporte: EmpresaTransporteEn,
    autoescuela: AutoescuelaEn,
    docker: DockerEn,
    tiendaJuegosDeMesa: TiendaJuegosDeMesaEn,
  },
};

export const slugsFor = (lang: Lang): string[] => Object.keys(content[lang]);

export const hasSlug = (lang: Lang, slug: string): boolean => slug in content[lang];
