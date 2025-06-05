class Constants {
  static readonly API_BASE_URL = 'http://localhost:52999'
  static readonly API_REQUEST_TIMEOUT = 10000
  static readonly API_REQUEST_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  static readonly API_REQUEST_RETRY = 3
  static readonly API_REQUEST_RETRY_DELAY = 1000

  // API ENDPOINTS

  // AUTH ENDPOINTS
  static readonly API_AUTH_LOGIN = '/auth-service/auth/login'
  static readonly API_AUTH_REGISTER = '/auth-service/register'
  static readonly API_GET_USER = '/auth-service/userInfo'
  static readonly API_GET_ROLES = '/auth-service/roles'
  static readonly API_DELETE_ROLE = '/auth-service/roles/'
  static readonly API_GET_ALL_USERS = '/auth-service/auth/get-all-user'
  static readonly API_CREATE_ROLE = '/auth-service/roles'
  static readonly API_ASSIGN_ROLE = '/auth-service/roles/assign-role'

  // COMPANY ENDPOINTS
  static readonly API_COMPANY_CREATE = '/company-service/companies'

  static readonly API_COMPANY_GET_ALL = '/company-service/companies'
  static readonly API_COMPANY_GET_DETAIL_BY_ID = '/company-service/companies/:id'
  static readonly API_COMPANY_GET_ALL_BY_BUSINESS_SECTOR = '/companies/get-all-by-sector/:sectorId'
  static readonly API_COMPANY_GET_BY_SYMBOL = '/company-service/companies/get-by-symbol/'
  static readonly API_COMPANY_PAGE = '/company-service/companies/get-page'
  static readonly API_COMPANY_GET_LEADERSHIP = 'company-service/employees/get-by-company/'
  static readonly API_COMPANY_GET_PERSON_DETAIL = 'company-service/persons/'
  static readonly API_COMPANY_SEARCH = '/company-service/companies/search/'
  static readonly API_COMPANY_GET_ALL_BY_SECTOR = '/company-service/companies/get-all-by-sector/'
  static readonly API_COMPANY_UPDATE = '/company-service/companies/update-company'

  // SECTOR ENDPOINTS
  static readonly API_GET_ALL_SECTORS = '/company-service/sectors'
  static readonly API_GET_SECTOR_PERCENTAGE = '/company-service/companies/percent-sectors'
  static readonly API_CREATE_BUSINESS_SECTOR = '/company-service/sectors'

  // PERSON ENDPOINTS
  static readonly API_CEO_GET_PAGINATION = '/company-service/persons/get-page'
  static readonly API_CEO_SEARCH = '/company-service/persons/search/'
  static readonly API_CEO_ADD = '/company-service/persons'

  // EMPLOYEES ENDPOINTS

  // FINANCIAL ENDPOINTS
  static readonly API_FINANCIAL_GET = '/finance-service/finance-reports/'
  static readonly API_FINANCIAL_IMPORT = '/finance-service/finance-reports/import'
  static readonly API_FINANCIAL_GET_TOPASSETS = '/finance-service/finance-reports/topAssets'
  static readonly API_FINANCIAL_GET_FIELD_DATA = '/finance-service/finance-reports/fieldData'

  // UPLOAD ENDPOINTS
  static readonly API_UPLOAD_GCS_FILE = '/upload-service/upload/gcs/single-file'
  static readonly API_UPLOAD_FROM_LOCAL = '/upload-service/upload/locals/single-file'

  //MAIL ENDPOINTS

  //POSITION ENDPOINTS
  static readonly API_POSITION_CREATE = '/company-service/positions'
  static readonly API_GET_COMPANY_POSITION = '/company-service/positions/get-by-company/'
}

export default Constants
