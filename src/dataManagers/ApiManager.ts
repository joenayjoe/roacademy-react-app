import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import { IGrade, ICourse, ILoginRequest, ILoginResponse, ICategory, ISearchRequest } from "../settings/DataTypes";

class ApiManager {

    private apiRequest: ApiRequest;
    constructor() {
        this.apiRequest = new ApiRequest();
    }

    public async getCategories(): Promise<AxiosResponse<ICategory[]>> {
        return await this.apiRequest.get<ICategory[]>("/categories");
    }

    public async getCategory(categoryId:string): Promise<AxiosResponse<ICategory>>{
        const url = "/categories/"+categoryId;
        return await this.apiRequest.get<ICategory>(url);
    }

    public async getCoursesForGrade(grade: IGrade): Promise<AxiosResponse<ICourse[]>> {
        const url = `/categories/${grade.categoryId}/grades/${grade.id}/courses`;
        return  await this.apiRequest.get<ICourse[]>(url);
    }

    public async getAutoSuggestForCourse(query:ISearchRequest): Promise<AxiosResponse<ICourse[]>> {
        const url = "/search";
        return await this.apiRequest.post<ISearchRequest, ICourse[]>(url, query);
    }

    public async login(loginData:ILoginRequest): Promise<AxiosResponse<ILoginResponse>> {
        return await this.apiRequest.post<ILoginRequest, ILoginResponse>("/auth/signin", loginData);
    }

}
export default ApiManager;