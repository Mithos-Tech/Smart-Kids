
import React from 'react';

const PageContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-dark p-8 sm:p-12 rounded-2xl space-y-6 text-light/80 leading-relaxed">
        {children}
    </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-2xl font-bold text-light pt-4 font-heading">{children}</h2>
);

const PrivacyPage: React.FC = () => {
    return (
        <div className="bg-darker text-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-heading text-4xl sm:text-5xl font-bold text-center mb-12">Política de Privacidad</h1>
                    <PageContentWrapper>
                        <p className="text-light/60"><strong>Última actualización:</strong> 24 de Julio de 2024</p>
                        
                        <p>
                            La privacidad y seguridad de nuestros estudiantes y usuarios es nuestra máxima prioridad. Esta Política de Privacidad describe cómo manejamos la información en el marco del proyecto Smart Kids.
                        </p>

                        <SectionTitle>1. Información que Recopilamos</SectionTitle>
                        <p>
                            <strong>Suscripción por Correo:</strong> Si decides suscribirte a nuestro boletín, recopilamos tu dirección de correo electrónico a través del servicio de terceros Formspark.io. No almacenamos esta información en nuestros propios servidores.
                            <strong>Navegación:</strong> No utilizamos cookies de seguimiento ni recopilamos datos personales identificables durante tu navegación por el sitio.
                        </p>

                        <SectionTitle>2. Uso de la Información</SectionTitle>
                        <p>
                           Tu correo electrónico, si lo proporcionas, se utilizará únicamente para enviarte notificaciones sobre nuevos episodios y noticias relevantes del proyecto. Nunca compartiremos ni venderemos tu correo electrónico a terceros.
                        </p>
                        
                        <SectionTitle>3. Protección de la Identidad de los Menores</SectionTitle>
                        <p>
                            Para proteger la identidad de nuestros estudiantes, solo utilizamos sus nombres de pila y grado académico. No se publicará ninguna otra información personal identificable, como apellidos completos, fotografías nítidas de sus rostros (sin consentimiento explícito de los padres) o datos de contacto. Todas las publicaciones cuentan con la autorización previa y por escrito de los padres o tutores legales.
                        </p>

                        <SectionTitle>4. Seguridad</SectionTitle>
                        <p>
                           Tomamos medidas razonables para proteger la información que se nos confía. Sin embargo, ninguna transmisión por Internet es 100% segura, por lo que no podemos garantizar una seguridad absoluta.
                        </p>

                        <SectionTitle>5. Tus Derechos</SectionTitle>
                        <p>
                           Puedes darte de baja de nuestra lista de correo en cualquier momento haciendo clic en el enlace "cancelar suscripción" que se encuentra en la parte inferior de nuestros correos electrónicos. Si eres padre o tutor y deseas que se elimine o modifique la información de tu hijo, por favor contáctanos.
                        </p>
                    </PageContentWrapper>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
