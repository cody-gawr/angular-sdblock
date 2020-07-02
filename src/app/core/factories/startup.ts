import { StartupService } from 'src/app/services/shared/startup';

export function startupServiceFactory(startupService: StartupService) {
    return (): Promise<any> => {
        return startupService.bootload();
    };
}
