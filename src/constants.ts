import * as Colors from './componentsBase/style/Colors';
import mixColors from './componentsBase/utils/mixColors';

export enum INDEX_NAME {
  TABULAR = 'tabular',
  TABULARROOT = 'tabularroot',
  STAGINGAREA = 'stagingarea',
  CONFIG = 'config',
  DICTIONARIES = 'dictionaries',
  CATALOGS = 'catalogs',
  CATEGORIES = 'categories',
  MEDIA = 'media',
  PUBLICATIONS = 'publications',
  READY = 'ready',
  FILES = 'files',
}

export const USER_AVATAR_PLACEHOLDER = '../static/user_100x100.png';

export const JWT_KEY = 'id_token';
export const AUTHORIZATION_TOKEN = 'warda-authorization';
export const REFRESH_TOKEN = 'warda-refreshToken';
export const ENTITYTYPE_VALUE = 'warda-entityTypeValue';
export const ENTITYTYPE_CLOSE = 'warda-entityTypeClose';
export const AUTH_PATH = '/';
export const AUTH_BASE_DOMAIN = '.wardacloud.com';

export const SUB = 'sub';
export const TENANT_ID = 'tenantId';
export const GROUP_ID = 'groupId';

export const missingKey = 'N/A';

export const categoryDefault = 'DEFAULT';

export const DATE_FORMAT = 'DD/MM/YYYY';

export const APP_NAME = 'Portfolio';

const color = !!global.location
  ? new URLSearchParams(global.location.search).get('colorTheme')
  : '';

export const colorTheme = !!color ? `#${color}` : Colors.Purple;
export const APP_COLORS = {
  color: colorTheme,
  colorLight: mixColors(0.7, colorTheme, '#fff'),
  colorDark: mixColors(0.7, colorTheme, '#000'),
};

export const ROOT_DIV_ID = 'app';

export const PANEL_DETAIL_WIDTH = 420;
export const PANEL_FILTER_WIDTH = 280;
export const FIELD_WIDTH = 360;

export const KEY_VIEW_CHECK = 'viewCheck';
export const KEY_VIEW_STATUS = 'viewStatus';
export const KEY_VIEW_DATA = 'viewData';
export const KEY_MEDIA = 'media';
export const KEY_READY = 'ready';
export const KEY_PUBLICATIONS = 'publications';
export const KEY_CATALOG = 'catalogs';
export const KEY_ENTITY_STRUCTURE_ID = 'entityStructureId';
export const KEY_ENTITY_ID = 'entityId';
export const KEY_ENTITY_TYPE = 'entityType';
export const KEY_ROOT_ID = 'rootDocumentId';
export const KEY_CARRYOVER_PARENT = 'carryOverParent';
export const KEY_ATTRIBUTE_SETS = 'attributeSets';
export const KEY_ASSIGNMENTS = 'assignments';
export const KEY_VIEWS_EDITING_PERFORMED = 'viewsEditingPerformed';
export const KEY_EDITED_ATTRIBUTES = 'editedAttributes';

export const SHOW_MEDIAREADY = 'WARDA_ShowMediaReady';

export const SHARE_ID = 'share'; // key shared with BE - not change

export const AREA_PRODUCTS = 'products'; // key used by user's JsonStore file
export const AREA_STAGING = 'stagingarea'; // key used by user's JsonStore file
export const AREA_LOOK = 'look';
export const AREA_PERFORMANCE = 'performance';
export const AREA_ATTRIBUTES = 'attributes-configuration';
export const AREA_CATALOGS = 'catalogs-configuration';
export const AREA_CATEGORIES = 'categories-configuration';
export const AREA_USERS = 'users-configuration';
export const AREA_PERMISSIONS = 'permissions-configuration';
export const AREA_FILES = 'digitalassets';
export const AREA_MY_WORK = 'my_work_area';

export const CHOOSE_PASSWORD_ID = 'choosepassword';

export const FORGOT_PASSWORD_ID = 'forgotpassword';

export const RESET_PASSWORD_ID = 'resetpassword';

export const LAYOUT_GRID = 'grid'; // used in jsonStore id - not change

export const ID_COLUMNS = 'columns'; // used in jsonStore id - not change
export const ID_FILTERS = 'filters'; // used in jsonStore id - not change
export const ID_FIELDS_PANEL_DETAILS = 'fields_panel_details'; // used in jsonStore id - not change

export const TYPE_FOLDER = 'application/vnd.warda-apps.folder';

export const MAX_COLUMN_SORT = 5;
export const FOLDER_ROOT_ID = 'root';
export const FOLDER_ROOT_LABEL = 'Root';

export const DEFAULT_WIDTH_COLUMN = 120;

//////// ⚠️ key parameter
export const KEYPAR_ENTITY = 'id';
export const KEYPAR_SHEET = 'detail';
export const KEYPAR_TAB = 'tab';
export const KEYPAR_IMG = 'img';
////////

export const MAX_PRODUCTS_SELECTABLE = 10000;
export const MAX_PRODUCTS_MASSIVE_ACTIONS = 500;

export const REFRESH_TOKEN_DURATION_IN_DAYS = 5;
