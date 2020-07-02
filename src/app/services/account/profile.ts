import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { NotificationService } from '../support/notification';
@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    profile: BehaviorSubject<any>;
    user: BehaviorSubject<any>;
    services: BehaviorSubject<any[]>;

    constructor(
        private http: HttpClient,
        private notificationService: NotificationService,
    ) {
        this.user = new BehaviorSubject({});
        this.services = new BehaviorSubject([]);
        this.profile = new BehaviorSubject({});
    }

    bootLoader() {
        return this.http.get<any>(`soundblock/bootloader`).pipe(map(response => {
            console.log('bootloader', response);
            this.parseBootloadData(response.data);
            return response.data;
        }));
    }

    parseBootloadData(data) {
        this.user.next(data.user);
        this.services.next(data.services);
        const setting = data.user.notification_setting.setting;
        this.notificationService.updateSettings(setting);
    }

    getUserProfile() {
        return this.http.get<any>(`user/profile`).pipe(map(res => {
            return res.data;
        }));
    }

    getAccount() {
        return this.http.get<any>(`soundblock/setting/account`).pipe(map(res => {
            return res.data;
        }));
    }

    createService(name, type, paymentId) {
        const req = { service_name: name, type, payment_id: paymentId };
        return this.http.post<any>(`soundblock/service/plan`, req).pipe(map(res => {
            return res.data;
        }));
    }

    updateService(type, paymentId) {
        const req = { type, payment_id: paymentId };
        return this.http.patch<any>(`soundblock/service/plan`, req).pipe(map(res => {
            return res.data;
        }));
    }

    cancelService() {
        const req = { };
        return this.http.post<any>(`soundblock/service/plan/cancel`, req).pipe(map(res => {
            return res.data;
        }));
    }

    getBasicUserInfo() {
        return this.user.asObservable();
    }

    getBasicUserServicesInfo() {
        return this.services.asObservable();
    }

    editName(name) {
        const req = { name };
        return this.http.patch<any>(`user/profile/name`, req).pipe(map(res => {
            return res.data;
        }));
    }

    addAddress(address) {
        const req = {
            postal_type: address.type,
            postal_street: address.street,
            postal_city: address.city,
            postal_zipcode: address.zipCode,
            postal_country: address.country
        };
        return this.http.post<any>(`user/profile/address`, req).pipe(map(res => {
            return res.data;
        }));
    }

    deleteAddress(uuid) {
        return this.http.delete<any>(`user/profile/address?postal=${uuid}`).pipe(map(res => {
            return res.data;
        }));
    }

    addEmail(email) {
        const req = { user_auth_email: email };
        return this.http.post<any>(`user/profile/email`, req).pipe(map(res => {
            return res.data;
        }));
    }

    setPrimaryEmail(email) {
        const req = { old_user_auth_email: email, user_auth_email: email, flag_primary: true };
        return this.http.patch<any>(`user/profile/email`, req).pipe(map(res => {
            return res.data;
        }));
    }

    deleteEmail(email) {
        return this.http.delete<any>(`user/profile/email?user_auth_email=${email}`).pipe(map(res => {
            return res.data;
        }));
    }

    verifyEmail(emailUuid) {
        return this.http.post<any>(`email/${emailUuid}/verify`, {}).pipe(map(res => {
            return res;
        }));
    }

    confirmEmailHash(hash) {
        return this.http.patch<any>(`email/${hash}`, {}).pipe(map(res => {
            return res;
        }));
    }

    addPhone(type, phoneNumber, flag) {
        const req = { phone_type: type, phone_number: phoneNumber, flag_primary: flag };
        return this.http.post<any>(`user/profile/phone`, req).pipe(map(res => {
            return res.data;
        }));
    }
    setPrimaryPhone(phone) {
        const req = { old_phone_number: phone, flag_primary: true };
        return this.http.patch<any>(`user/profile/phone`, req).pipe(map(res => {
            return res.data;
        }));
    }
    deletePhone(phoneNumber) {
        return this.http.delete<any>(`user/profile/phone?phone_number=${phoneNumber}`).pipe(map(res => {
            return res.data;
        }));
    }

    setPrimaryPayment(payment) {
        let req;
        if (payment.bank_uuid) {
            req = { type: 'bank', flag_primary: 1, bank: payment.bank_uuid};
        } else {
            req = { type: 'paypal', flag_primary: 1, paypal: payment.paypal_uuid};
        }
        return this.http.patch<any>(`user/profile/payment/primary`, req).pipe(map(res => {
            return res.data;
        }));
    }
    addPaypal(paypal) {
        const req = { paypal_email: paypal };
        return this.http.post<any>(`user/profile/paypal`, req).pipe(map(res => {
            return res.data;
        }));
    }

    deletePaypal(uuid) {
        return this.http.delete<any>(`user/profile/paypal?paypal=${uuid}`).pipe(map(res => {
            return res.data;
        }));
    }

    addBankAccount(bank) {
        const req = {
            bank_name: bank.name,
            account_type: bank.accountType,
            account_number: bank.accountNumber,
            routing_number: bank.routingNumber
        };
        return this.http.post<any>(`user/profile/bank`, req).pipe(map(res => {
            return res.data;
        }));
    }

    deleteBankAccount(uuid) {
        return this.http.delete<any>(`user/profile/bank?bank=${uuid}`).pipe(map(res => {
            return res.data;
        }));
    }
}
