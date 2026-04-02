/**
 * Guide and article shapes. Editing these objects in `src/data/copy/` updates the site;
 * TypeScript checks that every required field is present.
 */

export interface ChecklistItem {
  readonly done: boolean;
  readonly text: string;
}

/** One block of content under a heading (like a chapter). */
export interface TextSection {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly bullets?: readonly string[];
  readonly ordered?: readonly string[];
  readonly checklist?: readonly ChecklistItem[];
  /** Shown in a callout box — good for tips and warnings. */
  readonly tip?: string;
}

/** Standard guide page (progression, habitats, etc.). */
export interface Article {
  readonly title: string;
  readonly description: string;
  readonly sections: readonly TextSection[];
}

export interface NavLink {
  readonly href: string;
  readonly label: string;
}

/** Front page only — intro plus feature cards. */
export interface HomeContent {
  readonly title: string;
  readonly description: string;
  readonly intro: readonly string[];
  readonly sectionsHeading: string;
  readonly featureLinks: readonly {
    readonly href: string;
    readonly label: string;
    readonly blurb: string;
  }[];
  readonly forBuildersHeading: string;
  readonly forBuildersParagraphs: readonly string[];
}
