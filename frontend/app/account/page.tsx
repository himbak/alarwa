"use client"
import { useEffect, useState } from "react";
import { User, MapPin, Package, Heart, Star, Shield, Bell, LogOut, ChevronRight, Edit3, Plus, Trash2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLangStore } from "../../store/langStore";
import { translations } from "../../locales";

interface Address {
    _id: string;
    type: "livraison" | "facturation";
    street: string;
    city: string;
    zip: string;
    country: string;
    instructions?: string;
    isDefault: boolean;
}

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    addresses: Address[];
    scentProfile: string[];
    marketingPrefs: { newsletter: boolean, stockAlerts: boolean };
    wishlist: any[];
}

export default function AccountPage() {
    const lang = useLangStore((state: any) => state.lang) as keyof typeof translations;
    const t = translations[lang].account;
    const navT = translations[lang].nav;

    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    
    // Address Form State
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({ 
        type: "livraison" as "livraison" | "facturation", 
        street: "", city: "", zip: "", country: "", instructions: "", isDefault: false 
    });

    const tabs = [
        { id: "profile", label: t.profile, icon: User },
        { id: "addresses", label: t.addresses, icon: MapPin },
        { id: "orders", label: t.orders, icon: Package },
        { id: "wishlist", label: t.wishlist, icon: Heart },
        { id: "scent", label: t.scent, icon: Star },
        { id: "security", label: t.security, icon: Shield },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        fetchProfile();
        fetchOrders();
    }, []);

    useEffect(() => {
        if (user && user.scentProfile.length > 0) {
            fetchRecommendations();
        }
    }, [user?.scentProfile]);

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/account/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch (err) {
            console.error("Erreur profil:", err);
        }
    };

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/account/orders", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error("Erreur commandes:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommendations = async () => {
        try {
            const res = await fetch("/api/parfums");
            if (res.ok) {
                const allParfums = await res.json();
                const filtered = allParfums.filter((p: any) => {
                    const allNotes = [...p.topNotes, ...p.heartNotes, ...p.baseNotes].map(n => 
                        typeof n === 'string' ? n : (n as any).name
                    );
                    return user?.scentProfile.some(pref => 
                        allNotes.some(note => note?.toLowerCase().includes(pref.toLowerCase()))
                    );
                }).slice(0, 3);
                setRecommendations(filtered);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/account/profile", {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updates)
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setMessage("Mis à jour avec succès ✨");
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleScent = (note: string) => {
        if (!user) return;
        const newProfile = user.scentProfile.includes(note)
            ? user.scentProfile.filter(n => n !== note)
            : [...user.scentProfile, note];
        handleUpdateProfile({ scentProfile: newProfile });
    };

    const addAddress = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/account/addresses", {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newAddress)
            });
            if (res.ok) {
                const addresses = await res.json();
                setUser(prev => prev ? { ...prev, addresses } : null);
                setIsAddingAddress(false);
                setNewAddress({ 
                    type: "livraison", street: "", city: "", zip: "", country: "", instructions: "", isDefault: false 
                });
                setMessage("Adresse ajoutée !");
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteAddress = async (id: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`/api/account/addresses/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const addresses = await res.json();
                setUser(prev => prev ? { ...prev, addresses } : null);
                setMessage("Adresse supprimée");
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
            <div className="w-24 h-24 mb-6 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800">
                <Shield className="w-10 h-10 text-neutral-700" />
            </div>
            <h1 className="text-2xl font-black mb-2 text-white">Accès Réservé</h1>
            <p className="text-neutral-500 mb-8 max-w-xs text-center">Veuillez vous connecter pour accéder à votre espace ALARWA.</p>
            <Link href="/auth/login" className="bg-amber-500 text-black px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-400 transition shadow-xl shadow-amber-500/20">
                Connexion
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-20 pt-10 px-4 md:px-8">
            {message && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-amber-500 text-black px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-amber-500/40 animate-in slide-in-from-top-10">
                    {message}
                </div>
            )}
            
            <div className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 ${lang === 'ar' ? 'rtl' : ''}`}>
                
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 text-center overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-neutral-800 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-amber-500/20">
                                <User className="w-12 h-12 text-amber-500" />
                            </div>
                            <h2 className="text-xl font-black text-white">{user.name}</h2>
                            <p className="text-sm text-neutral-500">{user.email}</p>
                        </div>
                    </div>

                    <nav className="bg-neutral-900/50 border border-neutral-800 rounded-[32px] p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-tighter transition-all ${
                                    activeTab === tab.id 
                                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                                    : "text-neutral-500 hover:text-white hover:bg-neutral-800"
                                } ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="flex-1">{tab.label}</span>
                                {activeTab === tab.id && (lang === 'ar' ? <ChevronRight className="w-4 h-4 rotate-180" /> : <ChevronRight className="w-4 h-4" />)}
                            </button>
                        ))}
                    </nav>

                    <button 
                        onClick={() => { localStorage.clear(); window.location.href = "/"; }}
                        className={`w-full flex items-center gap-4 px-6 py-5 text-red-500/80 hover:text-red-500 transition-colors text-xs font-black uppercase tracking-widest border border-neutral-800 rounded-[32px] hover:bg-red-500/5 ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                        <LogOut className="w-5 h-5" /> {navT.logout}
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-[40px] p-8 md:p-12 min-h-[700px] backdrop-blur-xl relative overflow-hidden">
                        
                        {/* Tab Contents */}
                        {activeTab === "profile" && (
                            <div className={`space-y-12 animate-in fade-in slide-in-from-bottom-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                <div className={`flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <h3 className="text-4xl font-black text-white tracking-tighter">{t.profile}</h3>
                                    <Edit3 className="text-neutral-600 hover:text-amber-500 cursor-pointer transition-colors w-6 h-6" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Nom Complet</label>
                                        <div className="bg-neutral-800/30 p-5 rounded-3xl border border-neutral-800 font-bold text-lg">{user.name}</div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Email Officiel</label>
                                        <div className="bg-neutral-800/30 p-5 rounded-3xl border border-neutral-800 font-bold text-lg">{user.email}</div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Téléphone</label>
                                        <div className={`bg-neutral-800/30 p-5 rounded-3xl border border-neutral-800 font-bold text-lg text-neutral-400 italic ${lang === 'ar' ? 'text-right' : ''}`}>
                                            {user.phone || "Non renseigné"}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Statut Client</label>
                                        <div className={`inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                            <Star className="w-3 h-3 fill-current" /> Membre ALARWA Privilège
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-12 border-t border-neutral-800 space-y-8">
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600">Préférences Marketing</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => handleUpdateProfile({ marketingPrefs: { ...user.marketingPrefs, newsletter: !user.marketingPrefs.newsletter } })}
                                            className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${user.marketingPrefs.newsletter ? 'bg-amber-500/5 border-amber-500/30' : 'bg-neutral-900 border-neutral-800'}`}
                                        >
                                            <span className="text-sm font-bold">Newsletter & Offres</span>
                                            <div className={`w-10 h-5 rounded-full relative ${user.marketingPrefs.newsletter ? 'bg-amber-500' : 'bg-neutral-800'}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${user.marketingPrefs.newsletter ? 'left-6' : 'left-1'}`} />
                                            </div>
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateProfile({ marketingPrefs: { ...user.marketingPrefs, stockAlerts: !user.marketingPrefs.stockAlerts } })}
                                            className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${user.marketingPrefs.stockAlerts ? 'bg-amber-500/5 border-amber-500/30' : 'bg-neutral-900 border-neutral-800'}`}
                                        >
                                            <span className="text-sm font-bold">Alerte Disponibilité</span>
                                            <div className={`w-10 h-5 rounded-full relative ${user.marketingPrefs.stockAlerts ? 'bg-amber-500' : 'bg-neutral-800'}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${user.marketingPrefs.stockAlerts ? 'left-6' : 'left-1'}`} />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <div className={`space-y-10 animate-in fade-in slide-in-from-bottom-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                <div className={`flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <h3 className="text-4xl font-black text-white tracking-tighter">{t.addresses}</h3>
                                    <button 
                                        onClick={() => setIsAddingAddress(!isAddingAddress)}
                                        className="flex items-center gap-2 bg-amber-500 text-black px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition"
                                    >
                                        {isAddingAddress ? "X" : <><Plus className="w-5 h-5" /> {t.addAddress}</>}
                                    </button>
                                </div>

                                {isAddingAddress && (
                                    <div className="bg-neutral-900/80 border border-amber-500/20 rounded-[32px] p-8 space-y-6 animate-in zoom-in-95">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-neutral-500">Type</label>
                                                <select 
                                                    value={newAddress.type}
                                                    onChange={e => setNewAddress({...newAddress, type: e.target.value as any})}
                                                    className="w-full bg-neutral-800 border border-neutral-700 p-4 rounded-2xl text-sm outline-none focus:border-amber-500"
                                                >
                                                    <option value="livraison">Livraison</option>
                                                    <option value="facturation">Facturation</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-neutral-500">CP</label>
                                                <input 
                                                    placeholder="CP"
                                                    value={newAddress.zip}
                                                    onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                                                    className="w-full bg-neutral-800 border border-neutral-700 p-4 rounded-2xl text-sm outline-none focus:border-amber-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-neutral-500">Adresse</label>
                                            <input 
                                                placeholder="..."
                                                value={newAddress.street}
                                                onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                                className="w-full bg-neutral-800 border border-neutral-700 p-4 rounded-2xl text-sm outline-none focus:border-amber-500"
                                            />
                                        </div>
                                        <button 
                                            onClick={addAddress}
                                            disabled={!newAddress.street || !newAddress.city}
                                            className="w-full bg-white text-black py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 disabled:opacity-30 transition"
                                        >
                                            {t.addAddress}
                                        </button>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {user.addresses.length === 0 ? (
                                        <div className="col-span-full py-24 text-center bg-neutral-900/50 rounded-[40px] border border-dashed border-neutral-800">
                                            <MapPin className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
                                            <p className="text-neutral-500 font-bold">Aucune adresse enregistrée.</p>
                                        </div>
                                    ) : (
                                        user.addresses.map((addr) => (
                                            <div key={addr._id} className="p-8 bg-neutral-900 border border-neutral-800 rounded-[32px] group relative hover:border-amber-500/20 transition-all shadow-xl hover:shadow-amber-500/5">
                                                <div className={`flex items-start justify-between mb-6 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${
                                                        addr.type === 'facturation' ? 'text-blue-400 border-blue-400/20 bg-blue-400/5' : 'text-amber-400 border-amber-400/20 bg-amber-400/5'
                                                    }`}>
                                                        {addr.type === 'livraison' ? 'Livraison' : 'Facturation'}
                                                    </span>
                                                    {addr.isDefault && (
                                                        <div className={`flex items-center gap-1 text-green-500 text-[9px] font-black uppercase tracking-widest ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                                            <CheckCircle2 className="w-4 h-4" /> Par Défaut
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-white font-black text-xl mb-2">{addr.street}</p>
                                                <p className="text-neutral-500 font-bold text-sm mb-8">{addr.zip} {addr.city}, {addr.country}</p>
                                                <div className={`flex gap-3 ${lang === 'ar' ? 'justify-end' : ''}`}>
                                                    <button onClick={() => deleteAddress(addr._id)} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-600 hover:text-red-500 transition ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                                        <Trash2 className="w-4 h-4" /> Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "scent" && (
                            <div className={`space-y-12 animate-in fade-in slide-in-from-bottom-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                <div>
                                    <h3 className="text-4xl font-black text-white tracking-tighter mb-4">{t.scent}</h3>
                                    <p className="text-neutral-500 max-w-xl font-medium leading-relaxed">
                                        Sculptez votre identité parfumée. Nous utilisons votre profil pour personnaliser vos recommandations et vous donner accès aux avant-premières exclusives.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {["Vanille", "Oud", "Musc", "Bergamote", "Rose", "Jasmin", "Bois de Santal", "Lavande"].map((note) => (
                                        <button 
                                            key={note}
                                            onClick={() => toggleScent(note)}
                                            className={`p-8 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 group ${
                                                user.scentProfile.includes(note)
                                                ? "border-amber-500 bg-amber-500/5 text-amber-500 shadow-2xl shadow-amber-500/10"
                                                : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
                                            }`}
                                        >
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${user.scentProfile.includes(note) ? 'bg-amber-500/20' : 'bg-neutral-800'}`}>
                                                <Star className={`w-6 h-6 ${user.scentProfile.includes(note) ? "fill-current" : "text-neutral-600"}`} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{note}</span>
                                        </button>
                                    ))}
                                </div>

                                {recommendations.length > 0 && (
                                    <div className="mt-16 space-y-8 pt-12 border-t border-neutral-800">
                                        <div className="flex items-center gap-4">
                                            <div className="h-px bg-amber-500/30 flex-1"></div>
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-500">Sélection ALARWA pour vous</h4>
                                            <div className="h-px bg-amber-500/30 flex-1"></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {recommendations.map((p) => (
                                                <Link href={`/parfum/${p._id}`} key={p._id} className="group text-center">
                                                    <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-neutral-900 border border-neutral-800 mb-6 group-hover:border-amber-500/30 transition-all">
                                                        {p.image && <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                                                    </div>
                                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">{p.brand}</p>
                                                    <p className="text-lg font-black text-white">{p.name}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className={`space-y-10 animate-in fade-in slide-in-from-bottom-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                <h3 className="text-4xl font-black text-white tracking-tighter">{t.orders}</h3>
                                
                                {orders.length === 0 ? (
                                    <div className="py-24 text-center bg-neutral-900/50 rounded-[40px] border border-dashed border-neutral-800">
                                        <Package className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
                                        <p className="text-neutral-500 font-bold mb-6">Prêt pour votre première commande ?</p>
                                        <Link href="/" className="inline-block bg-neutral-800 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-neutral-700 transition">
                                            Explorer la maison
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div key={order._id} className="bg-neutral-900/80 border border-neutral-800 rounded-[32px] p-8 hover:border-neutral-700 transition-all">
                                                <div className={`flex flex-wrap items-center justify-between gap-6 mb-8 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                                    <div>
                                                        <p className="text-[10px] text-neutral-600 font-black uppercase tracking-[0.3em] mb-2">ARCHIVE #{order._id.slice(-8)}</p>
                                                        <p className="text-xl font-black text-white">{new Date(order.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                                                            order.status === 'Livrée' ? 'bg-green-500/5 text-green-500 border-green-500/20' : 
                                                            order.status === 'Expédiée' ? 'bg-blue-500/5 text-blue-500 border-blue-500/20' :
                                                            'bg-amber-500/5 text-amber-500 border-amber-500/20'
                                                        }`}>
                                                            {order.status}
                                                        </div>
                                                        <span className="text-2xl font-black text-white">{order.totalAmount} <span className="text-xs text-neutral-500 ml-1">MAD</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "wishlist" && (
                            <div className={`space-y-10 animate-in fade-in slide-in-from-bottom-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                <h3 className="text-4xl font-black text-white tracking-tighter">{t.wishlist}</h3>
                                {user.wishlist.length === 0 ? (
                                    <div className="py-24 text-center bg-neutral-900/50 rounded-[40px] border border-dashed border-neutral-800">
                                        <Heart className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
                                        <p className="text-neutral-500 font-bold">Laissez-vous tenter par une nouvelle fragrance.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {user.wishlist.map((item: any) => (
                                            <div key={item._id} className={`group flex items-center gap-6 bg-neutral-900/80 border border-neutral-800 rounded-[32px] p-6 hover:border-amber-500/20 transition-all ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-800">
                                                    {item.image ? (
                                                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <Package className="w-10 h-10 text-neutral-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">{item.brand}</p>
                                                    <p className="text-white font-black text-lg truncate leading-tight mb-1">{item.name}</p>
                                                    <p className="text-neutral-500 font-bold">{item.price} <span className="text-[10px]">MAD</span></p>
                                                </div>
                                                <Link href={`/parfum/${item._id}`} className="p-3 bg-neutral-800 rounded-2xl text-neutral-400 hover:text-amber-500 transition shadow-lg">
                                                    {lang === 'ar' ? <ChevronRight className="w-6 h-6 rotate-180" /> : <ChevronRight className="w-6 h-6" />}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                                <h3 className="text-4xl font-black text-white tracking-tighter">Sécurité & Confidentialité</h3>
                                
                                <div className="space-y-8 max-w-lg">
                                    <div className="p-10 bg-neutral-900 border border-neutral-800 rounded-[40px] space-y-8">
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black text-white">Changer de mot de passe</h4>
                                            <p className="text-xs text-neutral-500 font-medium">Nous recommandons d'utiliser une phrase secrète complexe.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <input type="password" placeholder="Mot de passe confidentiel actuel" className="w-full bg-neutral-800/50 border border-neutral-700 p-5 rounded-[24px] focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600 font-bold" />
                                            <input type="password" placeholder="Nouveau mot de passe" className="w-full bg-neutral-800/50 border border-neutral-700 p-5 rounded-[24px] focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600 font-bold" />
                                            <button className="w-full bg-amber-500 text-black py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] hover:bg-amber-400 transition shadow-xl shadow-amber-500/10">
                                                Droit à l'oubli & MAJ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
