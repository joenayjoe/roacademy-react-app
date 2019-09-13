import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import { IGrade, ICourse, ILoginRequest, ILoginResponse, ICategory } from "../settings/DataTypes";

class ApiManager {

    private apiRequest: ApiRequest;
    constructor() {
        this.apiRequest = new ApiRequest();
    }

    public async getCategories(): Promise<AxiosResponse<ICategory[]>> {
        return await this.apiRequest.get<ICategory[]>("/categories");
    }

    public async getCoursesForGrade(grade: IGrade): Promise<AxiosResponse<ICourse[]>> {
        const url = `/categories/${grade.categoryId}/grades/${grade.id}/courses`;
        return  await this.apiRequest.get<ICourse[]>(url);
    }

    public async login(loginData:ILoginRequest): Promise<AxiosResponse<ILoginResponse>> {
        return await this.apiRequest.post<ILoginRequest, ILoginResponse>("/auth/signin", loginData);
    }

}
export default ApiManager;