'use client';

import React, { useState } from 'react';
import {
    Settings,
    UploadCloud,
    ImageIcon,
    Save,
    Globe,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
    MessageCircle,
    Twitter,
    Clock,
    FileText,
    Loader2
} from 'lucide-react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useToast } from '@/hooks/use-toast';

interface SettingsClientProps {
    settings: any;
}

export default function SettingsClient({ settings }: SettingsClientProps) {
    const { toast } = useToast();
    const { uploadFile, isUploading } = useFileUpload();
    const [formData, setFormData] = useState(settings || {
        company_name: '',
        email: '',
        phone: '',
        phone_secondary: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
        logo: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        whatsapp: '',
        twitter: '',
        company_description: '',
        opening_hours: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                toast({ title: "Succès", description: "Paramètres enregistrés avec succès !" });
            } else {
                toast({ title: "Erreur", description: "Erreur lors de l'enregistrement.", variant: "destructive" });
            }
        } catch (error) {
            console.error("Save error:", error);
            toast({ title: "Erreur", description: "Erreur de connexion.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const result = await uploadFile(file);
            if (result.success) {
                setFormData({ ...formData, logo: result.url });
                toast({ title: "Logo mis à jour", description: "Le nouveau logo a été téléchargé." });
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-sm z-10 py-4 border-b">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                    <Settings className="mr-2 text-fulser-blue" size={24} />
                    Configuration du Site
                </h1>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center px-6 py-2.5 bg-fulser-blue text-white rounded-lg hover:bg-slate-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Save size={18} className="mr-2" />}
                    {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* General Info */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <h3 className="font-bold text-gray-900 border-b pb-3 flex items-center text-lg">
                            <Globe className="mr-2 text-fulser-blue" size={20} />
                            Identité & Description
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de la société</label>
                                <input
                                    type="text"
                                    value={formData.company_name || ''}
                                    onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fulser-gold/20 focus:border-fulser-gold outline-none transition-all"
                                    placeholder="Ex: Fulser Properties"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <FileText className="mr-2 opacity-50" size={16} />
                                    Description Courte
                                </label>
                                <textarea
                                    value={formData.company_description || ''}
                                    onChange={e => setFormData({ ...formData, company_description: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fulser-gold/20 focus:border-fulser-gold outline-none transition-all min-h-[100px]"
                                    placeholder="Une brève description de l'entreprise pour le footer..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contact Info */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <h3 className="font-bold text-gray-900 border-b pb-3 flex items-center text-lg">
                            <Phone className="mr-2 text-fulser-blue" size={20} />
                            Coordonnées de Contact
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email principal</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fulser-gold/20 focus:border-fulser-gold outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone principal</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.phone || ''}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fulser-gold/20 focus:border-fulser-gold outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone secondaire</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.phone_secondary || ''}
                                        onChange={e => setFormData({ ...formData, phone_secondary: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fulser-gold/20 focus:border-fulser-gold outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <Clock className="mr-2 opacity-50" size={16} />
                                    Horaires d'ouverture
                                </label>
                                <input
                                    type="text"
                                    value={formData.opening_hours || ''}
                                    onChange={e => setFormData({ ...formData, opening_hours: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fulser-gold/20 focus:border-fulser-gold outline-none transition-all"
                                    placeholder="Ex: Lun - Ven: 9:00 - 18:00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse physique</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.address || ''}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fulser-gold/20 focus:border-fulser-gold outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-xs">Ville</label>
                                <input
                                    type="text"
                                    value={formData.city || ''}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-fulser-gold outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-xs">Pays</label>
                                <input
                                    type="text"
                                    value={formData.country || ''}
                                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-fulser-gold outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-xs">Code Postal</label>
                                <input
                                    type="text"
                                    value={formData.postal_code || ''}
                                    onChange={e => setFormData({ ...formData, postal_code: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-fulser-gold outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Social Media */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <h3 className="font-bold text-gray-900 border-b pb-3 flex items-center text-lg">
                            <MessageCircle className="mr-2 text-fulser-blue" size={20} />
                            Réseaux Sociaux
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <Facebook className="mr-2 text-blue-600" size={16} /> Facebook
                                </label>
                                <input
                                    type="text"
                                    value={formData.facebook || ''}
                                    onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fulser-gold/20 focus:border-fulser-gold outline-none transition-all"
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <Instagram className="mr-2 text-pink-600" size={16} /> Instagram
                                </label>
                                <input
                                    type="text"
                                    value={formData.instagram || ''}
                                    onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fulser-gold/20 focus:border-fulser-gold outline-none transition-all"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <Linkedin className="mr-2 text-blue-700" size={16} /> LinkedIn
                                </label>
                                <input
                                    type="text"
                                    value={formData.linkedin || ''}
                                    onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fulser-gold/20 focus:border-fulser-gold outline-none transition-all"
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <WhatsappIcon className="mr-2 text-green-600" size={16} /> WhatsApp
                                </label>
                                <input
                                    type="text"
                                    value={formData.whatsapp || ''}
                                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fulser-gold/20 focus:border-fulser-gold outline-none transition-all"
                                    placeholder="+221..."
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {/* Logo Management */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center">
                            <ImageIcon className="mr-2 text-fulser-blue" size={18} />
                            Logo du Site
                        </h3>
                        <div className="space-y-4">
                            <div className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden relative group">
                                {formData.logo ? (
                                    <img src={formData.logo} className="w-full h-full object-contain p-4 transition-transform group-hover:scale-110" />
                                ) : (
                                    <div className="text-center p-4">
                                        <ImageIcon size={40} className="mx-auto text-slate-300 mb-2" />
                                        <p className="text-xs text-slate-400">Aucun logo</p>
                                    </div>
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-fulser-blue" size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                    id="logo-upload"
                                />
                                <label
                                    htmlFor="logo-upload"
                                    className="flex items-center justify-center w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors text-sm font-medium"
                                >
                                    <UploadCloud className="mr-2" size={18} />
                                    Télécharger un nouveau logo
                                </label>
                            </div>
                            <input
                                type="text"
                                value={formData.logo || ''}
                                onChange={e => setFormData({ ...formData, logo: e.target.value })}
                                placeholder="URL du logo..."
                                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 outline-none"
                            />
                        </div>
                    </section>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                        <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center">
                            <MessageCircle className="mr-2" size={16} />
                            Conseil
                        </h4>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            Pensez à utiliser des images au format PNG avec fond transparent pour le logo pour un meilleur rendu sur tous les thèmes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WhatsappIcon({ size, className }: { size: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    )
}
