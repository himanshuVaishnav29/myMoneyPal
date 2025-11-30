const AISuggestions = () => {
	return (
		<section>
			<div className=' text-white'>
				<div className='flex h-screen'>
					<div className='m-auto text-center'>
						<div>
							<img src='/coming_soon_image.svg' alt='AI Suggestions Coming Soon' />
						</div>
						<p className='text-sm md:text-base text-[#F6009B] p-2 mb-4'>
							AI-powered financial suggestions are coming soon!
						</p>
						<a
							href='/dashboard'
							className='bg-transparent hover:bg-[#F6009B] text-[#F6009B] hover:text-white rounded shadow hover:shadow-lg py-2 px-4 border border-[#F6009B] hover:border-transparent'
						>
							Back to Dashboard
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};
export default AISuggestions;