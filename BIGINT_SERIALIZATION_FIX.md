# Résolution de l'erreur BigInt Serialization

## 🎯 Problème

L'application générait l'erreur suivante lors de la sauvegarde de données :

```
TypeError: Do not know how to serialize a BigInt
    at JSON.stringify (<anonymous>)
```

Cette erreur se produisait car **Prisma retourne des BigInt** pour certains champs de la base de données (comme les IDs auto-incrémentés), et `JSON.stringify()` ne peut pas sérialiser les BigInt nativement.

## ✅ Solution Implémentée

### 1. Création d'une bibliothèque utilitaire (`lib/bigint-utils.ts`)

Nous avons créé un module réutilisable avec plusieurs fonctions pour gérer la sérialisation BigInt :

```typescript
/**
 * Convertit récursivement les BigInt en strings pour JSON
 */
export function serializeBigInt(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'bigint') return obj.toString();
    if (Array.isArray(obj)) return obj.map(serializeBigInt);
    if (typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
        );
    }
    return obj;
}

/**
 * Stringify sécurisé avec gestion BigInt
 */
export function stringifyWithBigInt(obj: any, space?: number): string {
    return JSON.stringify(serializeBigInt(obj), null, space);
}

/**
 * Replacer function pour JSON.stringify
 * Usage: JSON.stringify(data, bigIntReplacer)
 */
export function bigIntReplacer(key: string, value: any): any {
    return typeof value === 'bigint' ? value.toString() : value;
}
```

### 2. Mise à jour des composants client

Tous les composants qui envoient des données au serveur ont été mis à jour :

#### ✅ `components/settings/SettingsClient.tsx`
```typescript
import { serializeBigInt } from '@/lib/bigint-utils';

const handleSave = async () => {
    // ...
    body: JSON.stringify(serializeBigInt(formData)),
};
```

#### ✅ `components/residence-form.tsx`
```typescript
import { serializeBigInt } from '@/lib/bigint-utils';

const onSubmit = async (data: FormValues) => {
    // ...
    body: JSON.stringify(serializeBigInt(formattedData)),
};
```

#### ✅ `components/article-form.tsx`
```typescript
import { serializeBigInt } from '@/lib/bigint-utils';

const onSubmit = async (data: FormValues) => {
    // ...
    body: JSON.stringify(serializeBigInt(formattedData)),
};
```

#### ✅ `components/user-form.tsx`
```typescript
import { serializeBigInt } from '@/lib/bigint-utils';

const onSubmit = async (data: FormValues) => {
    // ...
    body: JSON.stringify(serializeBigInt(payload)),
};
```

## 📋 Fichiers Modifiés

1. **Nouveau fichier** : `lib/bigint-utils.ts`
2. **Modifié** : `components/settings/SettingsClient.tsx`
3. **Modifié** : `components/residence-form.tsx`
4. **Modifié** : `components/article-form.tsx`
5. **Modifié** : `components/user-form.tsx`

## 🔍 Pourquoi ce problème se produit ?

- **Prisma** utilise BigInt pour les champs `@id @default(autoincrement())` dans PostgreSQL
- **JavaScript** a un type `bigint` natif, mais `JSON.stringify()` ne sait pas comment le sérialiser
- Les données provenant de la base de données contiennent donc des BigInt qui causent des erreurs lors de la sérialisation JSON

## 🚀 Avantages de cette solution

1. **Réutilisable** : La fonction `serializeBigInt()` peut être utilisée partout dans l'application
2. **Récursive** : Gère les objets imbriqués et les tableaux automatiquement
3. **Type-safe** : Préserve tous les autres types de données
4. **Performante** : Conversion simple en string sans overhead
5. **Maintenable** : Centralisée dans un seul fichier utilitaire

## 📝 Notes Importantes

### Côté Serveur (API Routes)
Les routes API utilisent déjà une approche similaire avec un replacer inline :

```typescript
// Exemple dans app/api/admin/users/route.ts
const serialized = JSON.parse(
    JSON.stringify(users, (_, v) => typeof v === 'bigint' ? v.toString() : v)
);
```

### Côté Client (Composants)
Maintenant tous les composants utilisent `serializeBigInt()` avant d'envoyer des données au serveur.

## ✅ Test de Validation

Pour vérifier que tout fonctionne :

1. **Démarrer le serveur** : `pnpm run dev`
2. **Tester la sauvegarde des paramètres** : `/admin/settings`
3. **Créer/Modifier une résidence** : `/admin/residences`
4. **Créer/Modifier un article** : `/admin/articles`
5. **Créer/Modifier un utilisateur** : `/admin/users`

Aucune erreur BigInt ne devrait apparaître dans la console ! ✨

## 🔗 Ressources

- [MDN: BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [Prisma BigInt Support](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#bigint)
- [JSON.stringify() limitations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description)
