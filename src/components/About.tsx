import { Link } from "react-router-dom"
import Footer from "./Footer"

function About() {
  return (
    <>
      <div className='px-5 mt-14'>
        <h1 className='text-8xl font-serif mt-40 mb-20 text-center'>About Chris</h1>
        <div className="flex flex-row gap-10 justify-center items-start mb-40">
          <img className='w-[300px]' src="images/chris-elliott.png" alt="" />
          <div className='flex flex-col items-start text-lg gap-5 max-w-2xl'>
              <p>Chris Elliott (1958-2022) was born in North Carolina, the son of a Baptist preacher and his homemaker wife. The family moved frequently, and Chris grew up in West Virginia and Illinois, and graduated from the University of Illinois, Champaign-Urbana, with a BS degree in Electrical Engineering in 1981.</p>
              <p>Chris was inventive from an early age, and favorite memories included boiling bones and reconstructing the skeletons of road-killed animals, and teaching himself to weld in his family basement while his unaware family lounged above. He developed a deep interest for early computers, spending hours as a teen in the U of I computer labs exploring a new world. He was the consummate problem solver. After graduation, Chris rode his motorcycle out to San Diego to work at Linkabit. Over the years, Chris worked for GD Laser Systems, Novatrix, Nuvasive, and Volcano/Philips.</p>
              <p>In 1981, Chris began lifelong studies of art as an oil painter, training at UCSD, SDSU, and with private teachers before setting out to practice on his own. After family, art was the most important aspect of his life. Chris was always drawing, and never left the house without a sketch pad. He always made time to paint, sometimes four nights a week and one day each weekend, both in his studio and plein air landscapes of a changing San Diego, and his family supported this vocation with simple living. He left behind some 300-350 paintings, including plein air landscapes, urban scapes, abstracts, portraits, still lifes, Old Masters reproductions, and thousands of sketches.</p>
              <p>Chris was an active volunteer, spending years as a youth soccer coach for Mesa Soccer and as the theater tech director and board member for Center Stage Children&#39;s Theater of Mission Hills from 2009 - 2017 working with children to design and paint sets, build props, lighting and sound systems. Chris’s background in both fine art and engineering, as well as his love for children, made him the perfect set designer and tech teacher. He wanted kids to feel empowered by the experience of designing and creating their own sets, and to understand themselves as problem solvers and creative thinkers. How can you make a snow scene when the bubble-snow blower you rented sounds like a leaf blower and drowns out kids’ voices? Build an insulated box for it. How can you create a 15 foot diameter peach for James and the Giant Peach, with inside and outside both visible, that can be stored after the play is over? Use Tyvek, the house-coating material on a collapsible wire frame! How can you create a giant airplane for a character to fly through a scene? Use paper mache, the labor of ten kids, balsa wood, and shiny red paint.</p>
              <p>Chris died September 12, 2022 of neuroendocrince cancer. He did not want to leave his creative and inventive life or family behind. In the end, his death was peaceful and natural, surrounded by the family who loved him so much.</p>
              <Link className='link text-blue-600 border-blue-600' to="https://www.sandiegouniontribune.com/2022/12/14/after-her-husbands-death-a-san-diego-widow-wants-to-make-sure-his-artistic-legacy-lives-on/" target="_blank">Read an article here</Link>
            </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About
