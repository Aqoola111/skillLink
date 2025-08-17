'use client'

import {ComponentType, SVGProps, useEffect, useState} from "react";

interface LucideDynamicProps {
	name: string;
	className: string
	svgProps?: SVGProps<SVGElement>;
}

export const LucideDynamic = ({className, name, svgProps}: LucideDynamicProps) => {
	const [Comp, setComp] = useState<ComponentType<SVGProps<SVGElement>> | null>(null)
	
	useEffect(() => {
		if (!name) return
		let active = true
		
		import(`lucide-react/dist/esm/icons/${name}.js`)
			.then((m) => {
				if (active) setComp(() => m.default);
			})
			.catch(() => {
				if (active) setComp(null);
			});
		
		return () => {
			active = false;
		};
		
	}, [name])
	
	if (!Comp) return null;
	return <Comp {...svgProps} className={className}/>;
	
};