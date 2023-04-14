import vi from '../../locales/vi';
import en from '../../locales/en';
import cn from '../../locales/cn';
import {_retrieveData,_storeData} from './storages';

export default class t{
    lang = 'vi';
    dictionary ={};
    
    loadLang = async()=>{
        this.lang = await _retrieveData('culture', 1);
        this.lang = this.lang == 1? 'vi': this.lang == 2 ? 'en' : this.lang == 5 ? 'cn' :null;
        if (__DEV__) {
            this.dictionary =  await _retrieveData('dictionary');
            if(this.dictionary){
                this.dictionary = JSON.parse(this.dictionary);
            }
            else{
                this.dictionary ={};
            }
        }
        return this;
    }
    Get= (key,args)=>{
        let value = key in i18n[this.lang]? i18n[this.lang][key] :key;
        let i = 0;

        value= value.replace(/%s/g, function() {
            return args[i++];
        });
        if (__DEV__) {
            if(!(key in this.dictionary) && key===value){
                this.dictionary[key.toString()] = value;
                _storeData('dictionary',JSON.stringify(this.dictionary));
            }
        }
        return value;
    }
}
export const i18n={
    vi: vi,
    en: en,
    cn: cn,
}